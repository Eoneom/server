import { vi, type MockInstance } from 'vitest'
import assert from 'assert'
import { sagaFinishExplore } from './explore'
import { finishTroopExploreMovement } from '#app/command/troop/movement/finish/explore'
import { finishTroopBaseMovement } from '#app/command/troop/movement/finish/base'

vi.mock('#app/command/troop/movement/finish/explore')
vi.mock('#app/command/troop/movement/finish/base')

describe('sagaFinishExplore', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const base_movement_id = 'base_movement_id'

  beforeEach(() => {
    vi.clearAllMocks()
    ;(finishTroopBaseMovement as MockInstance).mockResolvedValue({ is_outpost_created: false })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls finishTroopExploreMovement with correct args', async () => {
    ;(finishTroopExploreMovement as MockInstance).mockResolvedValue({
      base_movement: { id: base_movement_id, isArrived: () => false }
    })

    await sagaFinishExplore({ player_id, movement_id })

    assert.strictEqual((finishTroopExploreMovement as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishTroopExploreMovement as MockInstance).mock.calls[0][0], { player_id, movement_id })
  })

  it('calls finishTroopBaseMovement with base_movement.id when base movement has arrived', async () => {
    ;(finishTroopExploreMovement as MockInstance).mockResolvedValue({
      base_movement: { id: base_movement_id, isArrived: () => true }
    })

    await sagaFinishExplore({ player_id, movement_id })

    assert.strictEqual((finishTroopBaseMovement as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishTroopBaseMovement as MockInstance).mock.calls[0][0], { player_id, movement_id: base_movement_id })
  })

  it('does not call finishTroopBaseMovement when base movement has not arrived', async () => {
    ;(finishTroopExploreMovement as MockInstance).mockResolvedValue({
      base_movement: { id: base_movement_id, isArrived: () => false }
    })

    await sagaFinishExplore({ player_id, movement_id })

    assert.strictEqual((finishTroopBaseMovement as MockInstance).mock.calls.length, 0)
  })

  it('propagates errors from finishTroopExploreMovement', async () => {
    ;(finishTroopExploreMovement as MockInstance).mockRejectedValue(new Error('explore error'))

    await assert.rejects(() => sagaFinishExplore({ player_id, movement_id }), /explore error/)
    assert.strictEqual((finishTroopBaseMovement as MockInstance).mock.calls.length, 0)
  })
})
