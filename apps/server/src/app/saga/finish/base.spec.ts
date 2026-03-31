import assert from 'assert'
import { sagaFinishBase } from './base'
import { finishTroopBaseMovement } from '#app/command/troop/movement/finish/base'
import { rebaseTroopMovement } from '#app/command/troop/movement/rebase'
import { OutpostError } from '#core/outpost/error'

jest.mock('#app/command/troop/movement/finish/base')
jest.mock('#app/command/troop/movement/rebase')

describe('sagaFinishBase', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(finishTroopBaseMovement as jest.Mock).mockResolvedValue({ is_outpost_created: true })
    ;(rebaseTroopMovement as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls finishTroopBaseMovement with correct args', async () => {
    await sagaFinishBase({ player_id, movement_id })

    assert.strictEqual((finishTroopBaseMovement as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishTroopBaseMovement as jest.Mock).mock.calls[0][0], { player_id, movement_id })
  })

  it('returns the result of finishTroopBaseMovement on success', async () => {
    const expected = { is_outpost_created: true }
    ;(finishTroopBaseMovement as jest.Mock).mockResolvedValue(expected)

    const result = await sagaFinishBase({ player_id, movement_id })

    assert.deepStrictEqual(result, expected)
    assert.strictEqual((rebaseTroopMovement as jest.Mock).mock.calls.length, 0)
  })

  it('calls rebaseTroopMovement when LIMIT_REACHED error is thrown', async () => {
    ;(finishTroopBaseMovement as jest.Mock).mockRejectedValue(new Error(OutpostError.LIMIT_REACHED))

    await sagaFinishBase({ player_id, movement_id })

    assert.strictEqual((rebaseTroopMovement as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((rebaseTroopMovement as jest.Mock).mock.calls[0][0], { player_id, movement_id })
  })

  it('returns { is_outpost_created: false } when LIMIT_REACHED error is thrown', async () => {
    ;(finishTroopBaseMovement as jest.Mock).mockRejectedValue(new Error(OutpostError.LIMIT_REACHED))

    const result = await sagaFinishBase({ player_id, movement_id })

    assert.deepStrictEqual(result, { is_outpost_created: false })
  })

  it('rethrows errors that are not LIMIT_REACHED', async () => {
    ;(finishTroopBaseMovement as jest.Mock).mockRejectedValue(new Error('unexpected error'))

    await assert.rejects(() => sagaFinishBase({ player_id, movement_id }), /unexpected error/)
    assert.strictEqual((rebaseTroopMovement as jest.Mock).mock.calls.length, 0)
  })
})
