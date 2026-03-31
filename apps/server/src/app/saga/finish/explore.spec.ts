import assert from 'assert'
import { sagaFinishExplore } from './explore'
import { finishTroopExploreMovement } from '#app/command/troop/movement/finish/explore'
import { finishTroopBaseMovement } from '#app/command/troop/movement/finish/base'

jest.mock('#app/command/troop/movement/finish/explore')
jest.mock('#app/command/troop/movement/finish/base')

describe('sagaFinishExplore', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const base_movement_id = 'base_movement_id'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(finishTroopBaseMovement as jest.Mock).mockResolvedValue({ is_outpost_created: false })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls finishTroopExploreMovement with correct args', async () => {
    ;(finishTroopExploreMovement as jest.Mock).mockResolvedValue({
      base_movement: { id: base_movement_id, isArrived: () => false }
    })

    await sagaFinishExplore({ player_id, movement_id })

    assert.strictEqual((finishTroopExploreMovement as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishTroopExploreMovement as jest.Mock).mock.calls[0][0], { player_id, movement_id })
  })

  it('calls finishTroopBaseMovement with base_movement.id when base movement has arrived', async () => {
    ;(finishTroopExploreMovement as jest.Mock).mockResolvedValue({
      base_movement: { id: base_movement_id, isArrived: () => true }
    })

    await sagaFinishExplore({ player_id, movement_id })

    assert.strictEqual((finishTroopBaseMovement as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishTroopBaseMovement as jest.Mock).mock.calls[0][0], { player_id, movement_id: base_movement_id })
  })

  it('does not call finishTroopBaseMovement when base movement has not arrived', async () => {
    ;(finishTroopExploreMovement as jest.Mock).mockResolvedValue({
      base_movement: { id: base_movement_id, isArrived: () => false }
    })

    await sagaFinishExplore({ player_id, movement_id })

    assert.strictEqual((finishTroopBaseMovement as jest.Mock).mock.calls.length, 0)
  })

  it('propagates errors from finishTroopExploreMovement', async () => {
    ;(finishTroopExploreMovement as jest.Mock).mockRejectedValue(new Error('explore error'))

    await assert.rejects(() => sagaFinishExplore({ player_id, movement_id }), /explore error/)
    assert.strictEqual((finishTroopBaseMovement as jest.Mock).mock.calls.length, 0)
  })
})
