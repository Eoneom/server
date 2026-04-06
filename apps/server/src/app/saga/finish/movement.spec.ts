import {
  vi, type MockInstance 
} from 'vitest'
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

vi.mock('#app/saga/finish/base')
vi.mock('#app/saga/finish/explore')
vi.mock('#query/troop/movement/list-finished')
vi.mock('#query/troop/movement/get-action')

describe('sagaFinishMovement', () => {
  const player_id = 'player_id'
  const key = `finish-movement-${player_id}`

  let lock: Lock
  let emit: MockInstance
  let listFinishedRun: MockInstance
  let getActionRun: MockInstance

  beforeEach(() => {
    vi.clearAllMocks()

    lock = {
      has: vi.fn().mockReturnValue(false),
      set: vi.fn(),
      delete: vi.fn(),
    }
    emit = vi.fn()

    vi.spyOn(Factory, 'getLock').mockReturnValue(lock)
    vi.spyOn(Factory, 'getEventBus').mockReturnValue({ emit } as never)

    listFinishedRun = vi.fn().mockResolvedValue({ movement_ids: [] })
    getActionRun = vi.fn().mockResolvedValue({ action: MovementAction.BASE })

    ;(TroopMovementListFinishedQuery as MockInstance).mockImplementation(function () {
      return { run: listFinishedRun }
    })
    ;(TroopMovementGetActionQuery as MockInstance).mockImplementation(function () {
      return { run: getActionRun }
    })

    ;(sagaFinishBase as MockInstance).mockResolvedValue({ is_outpost_created: false })
    ;(sagaFinishExplore as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns early without running queries when lock is already held', async () => {
    (lock.has as MockInstance).mockReturnValue(true)

    await sagaFinishMovement({ player_id })

    assert.strictEqual(listFinishedRun.mock.calls.length, 0)
    assert.strictEqual(emit.mock.calls.length, 0)
  })

  it('acquires the lock with the player-specific key', async () => {
    await sagaFinishMovement({ player_id })

    assert.strictEqual((lock.has as MockInstance).mock.calls[0][0], key)
    assert.strictEqual((lock.set as MockInstance).mock.calls[0][0], key)
  })

  it('releases the lock after completion', async () => {
    await sagaFinishMovement({ player_id })

    assert.strictEqual((lock.delete as MockInstance).mock.calls.length, 1)
    assert.strictEqual((lock.delete as MockInstance).mock.calls[0][0], key)
  })

  it('does not emit events when no movements are finished', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [] })

    await sagaFinishMovement({ player_id })

    assert.strictEqual(emit.mock.calls.length, 0)
  })

  it('calls sagaFinishBase for BASE movements', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [ 'm1' ] })
    getActionRun.mockResolvedValue({ action: MovementAction.BASE })

    await sagaFinishMovement({ player_id })

    assert.strictEqual((sagaFinishBase as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((sagaFinishBase as MockInstance).mock.calls[0][0], {
      player_id,
      movement_id: 'm1' 
    })
    assert.strictEqual((sagaFinishExplore as MockInstance).mock.calls.length, 0)
  })

  it('calls sagaFinishExplore for EXPLORE movements', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [ 'm1' ] })
    getActionRun.mockResolvedValue({ action: MovementAction.EXPLORE })

    await sagaFinishMovement({ player_id })

    assert.strictEqual((sagaFinishExplore as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((sagaFinishExplore as MockInstance).mock.calls[0][0], {
      player_id,
      movement_id: 'm1' 
    })
    assert.strictEqual((sagaFinishBase as MockInstance).mock.calls.length, 0)
  })

  it('emits TroopMovementFinished when at least one movement is processed', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [ 'm1' ] })

    await sagaFinishMovement({ player_id })

    const emitted_events = emit.mock.calls.map(([ event ]) => event)
    assert.ok(emitted_events.includes(AppEvent.TroopMovementFinished))
    const troop_call = emit.mock.calls.find(([ event ]) => event === AppEvent.TroopMovementFinished)
    assert.deepStrictEqual(troop_call[1], { player_id })
  })

  it('emits OutpostCreated when an outpost is created', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [ 'm1' ] })
    getActionRun.mockResolvedValue({ action: MovementAction.BASE })
    ;(sagaFinishBase as MockInstance).mockResolvedValue({ is_outpost_created: true })

    await sagaFinishMovement({ player_id })

    const emitted_events = emit.mock.calls.map(([ event ]) => event)
    assert.ok(emitted_events.includes(AppEvent.TroopMovementFinished))
    assert.ok(emitted_events.includes(AppEvent.OutpostCreated))
    const outpost_call = emit.mock.calls.find(([ event ]) => event === AppEvent.OutpostCreated)
    assert.deepStrictEqual(outpost_call[1], { player_id })
  })

  it('does not emit OutpostCreated when no outpost is created', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [ 'm1' ] })
    ;(sagaFinishBase as MockInstance).mockResolvedValue({ is_outpost_created: false })

    await sagaFinishMovement({ player_id })

    const emitted_events = emit.mock.calls.map(([ event ]) => event)
    assert.ok(!emitted_events.includes(AppEvent.OutpostCreated))
  })

  it('throws when an unknown movement action is encountered', async () => {
    listFinishedRun.mockResolvedValue({ movement_ids: [ 'm1' ] })
    getActionRun.mockResolvedValue({ action: 'unknown_action' })

    await assert.rejects(
      () => sagaFinishMovement({ player_id }),
      new RegExp(TroopError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
    )
  })

  it('processes multiple movements', async () => {
    listFinishedRun.mockResolvedValue({
      movement_ids: [
        'm1',
        'm2',
        'm3' 
      ] 
    })
    getActionRun.mockResolvedValue({ action: MovementAction.BASE })

    await sagaFinishMovement({ player_id })

    assert.strictEqual((sagaFinishBase as MockInstance).mock.calls.length, 3)
  })
})
