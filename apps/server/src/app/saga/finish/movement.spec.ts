import assert from 'assert'
import { sagaFinishMovement } from './movement'
import { sagaFinishBase } from '#app/saga/finish/base'
import { sagaFinishExplore } from '#app/saga/finish/explore'
import { TroopMovementListFinishedQuery } from '#query/troop/movement/list-finished'
import { TroopMovementGetActionQuery } from '#query/troop/movement/get-action'
import { Factory } from '#adapter/factory'
import { MovementAction } from '#core/troop/constant/movement-action'
import { TroopError } from '#core/troop/error'
import { AppEvent } from '#core/events'
import { Lock } from '#app/port/lock'

jest.mock('#app/saga/finish/base')
jest.mock('#app/saga/finish/explore')
jest.mock('#query/troop/movement/list-finished')
jest.mock('#query/troop/movement/get-action')

describe('sagaFinishMovement', () => {
  const player_id = 'player_id'
  const key = `finish-movement-${player_id}`

  let lock: Lock
  let emit: jest.Mock
  let listFinishedRun: jest.Mock
  let getActionRun: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    lock = {
      has: jest.fn().mockReturnValue(false),
      set: jest.fn(),
      delete: jest.fn(),
    }
    emit = jest.fn()

    jest.spyOn(Factory, 'getLock').mockReturnValue(lock)
    jest.spyOn(Factory, 'getEventBus').mockReturnValue({ emit } as never)

    listFinishedRun = jest.fn().mockResolvedValue({ movement_ids: [] })
    getActionRun = jest.fn().mockResolvedValue({ action: MovementAction.BASE })

    ;(TroopMovementListFinishedQuery as jest.Mock).mockImplementation(() => ({ run: listFinishedRun }))
    ;(TroopMovementGetActionQuery as jest.Mock).mockImplementation(() => ({ run: getActionRun }))

    ;(sagaFinishBase as jest.Mock).mockResolvedValue({ is_outpost_created: false })
    ;(sagaFinishExplore as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns early without running queries when lock is already held', async () => {
    ;(lock.has as jest.Mock).mockReturnValue(true)

    await sagaFinishMovement({ player_id })

    assert.strictEqual(listFinishedRun.mock.calls.length, 0)
    assert.strictEqual(emit.mock.calls.length, 0)
  })

  it('acquires the lock with the player-specific key', async () => {
    await sagaFinishMovement({ player_id })

    assert.strictEqual((lock.has as jest.Mock).mock.calls[0][0], key)
    assert.strictEqual((lock.set as jest.Mock).mock.calls[0][0], key)
  })

  it('releases the lock after completion', async () => {
    await sagaFinishMovement({ player_id })

    assert.strictEqual((lock.delete as jest.Mock).mock.calls.length, 1)
    assert.strictEqual((lock.delete as jest.Mock).mock.calls[0][0], key)
  })

  it('does not emit events when no movements are finished', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [] })

    await sagaFinishMovement({ player_id })

    assert.strictEqual(emit.mock.calls.length, 0)
  })

  it('calls sagaFinishBase for BASE movements', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1'] })
    getActionRun.mockResolvedValue({ action: MovementAction.BASE })

    await sagaFinishMovement({ player_id })

    assert.strictEqual((sagaFinishBase as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((sagaFinishBase as jest.Mock).mock.calls[0][0], { player_id, movement_id: 'm1' })
    assert.strictEqual((sagaFinishExplore as jest.Mock).mock.calls.length, 0)
  })

  it('calls sagaFinishExplore for EXPLORE movements', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1'] })
    getActionRun.mockResolvedValue({ action: MovementAction.EXPLORE })

    await sagaFinishMovement({ player_id })

    assert.strictEqual((sagaFinishExplore as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((sagaFinishExplore as jest.Mock).mock.calls[0][0], { player_id, movement_id: 'm1' })
    assert.strictEqual((sagaFinishBase as jest.Mock).mock.calls.length, 0)
  })

  it('emits TroopMovementFinished when at least one movement is processed', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1'] })

    await sagaFinishMovement({ player_id })

    const emitted_events = emit.mock.calls.map(([event]) => event)
    assert.ok(emitted_events.includes(AppEvent.TroopMovementFinished))
    const troop_call = emit.mock.calls.find(([event]) => event === AppEvent.TroopMovementFinished)
    assert.deepStrictEqual(troop_call[1], { player_id })
  })

  it('emits OutpostCreated when an outpost is created', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1'] })
    getActionRun.mockResolvedValue({ action: MovementAction.BASE })
    ;(sagaFinishBase as jest.Mock).mockResolvedValue({ is_outpost_created: true })

    await sagaFinishMovement({ player_id })

    const emitted_events = emit.mock.calls.map(([event]) => event)
    assert.ok(emitted_events.includes(AppEvent.TroopMovementFinished))
    assert.ok(emitted_events.includes(AppEvent.OutpostCreated))
    const outpost_call = emit.mock.calls.find(([event]) => event === AppEvent.OutpostCreated)
    assert.deepStrictEqual(outpost_call[1], { player_id })
  })

  it('does not emit OutpostCreated when no outpost is created', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1'] })
    ;(sagaFinishBase as jest.Mock).mockResolvedValue({ is_outpost_created: false })

    await sagaFinishMovement({ player_id })

    const emitted_events = emit.mock.calls.map(([event]) => event)
    assert.ok(!emitted_events.includes(AppEvent.OutpostCreated))
  })

  it('throws when an unknown movement action is encountered', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1'] })
    getActionRun.mockResolvedValue({ action: 'unknown_action' })

    await assert.rejects(
      () => sagaFinishMovement({ player_id }),
      new RegExp(TroopError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
    )
  })

  it('processes multiple movements', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: ['m1', 'm2', 'm3'] })
    getActionRun.mockResolvedValue({ action: MovementAction.BASE })

    await sagaFinishMovement({ player_id })

    assert.strictEqual((sagaFinishBase as jest.Mock).mock.calls.length, 3)
  })
})
