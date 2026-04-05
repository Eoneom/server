import { vi, type MockInstance } from 'vitest'
import assert from 'assert'
import { sagaRecruitTroop } from './troop-recruit'
import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'
import { recruitTroop } from '#app/command/troop/recruit'
import { TroopCode } from '#core/troop/constant/code'

vi.mock('#app/command/building/finish-upgrade')
vi.mock('#app/command/technology/finish-research')
vi.mock('#app/command/troop/recruit')

describe('sagaRecruitTroop', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const troop_code = TroopCode.EXPLORER
  const count = 5

  beforeEach(() => {
    vi.clearAllMocks()
    ;(finishBuildingUpgrade as MockInstance).mockResolvedValue(null)
    ;(finishTechnologyResearch as MockInstance).mockResolvedValue(undefined)
    ;(recruitTroop as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls finishBuildingUpgrade with player_id and city_id', async () => {
    await sagaRecruitTroop({ player_id, city_id, troop_code, count })

    assert.strictEqual((finishBuildingUpgrade as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishBuildingUpgrade as MockInstance).mock.calls[0][0], { player_id, city_id })
  })

  it('calls finishTechnologyResearch with player_id', async () => {
    await sagaRecruitTroop({ player_id, city_id, troop_code, count })

    assert.strictEqual((finishTechnologyResearch as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishTechnologyResearch as MockInstance).mock.calls[0][0], { player_id })
  })

  it('calls recruitTroop with correct args', async () => {
    await sagaRecruitTroop({ player_id, city_id, troop_code, count })

    assert.strictEqual((recruitTroop as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((recruitTroop as MockInstance).mock.calls[0][0], { player_id, city_id, troop_code, count })
  })

  it('calls commands in order: finishBuildingUpgrade, finishTechnologyResearch, recruitTroop', async () => {
    const order: string[] = []
    ;(finishBuildingUpgrade as MockInstance).mockImplementation(async () => { order.push('finish-building'); return null })
    ;(finishTechnologyResearch as MockInstance).mockImplementation(async () => { order.push('finish-technology') })
    ;(recruitTroop as MockInstance).mockImplementation(async () => { order.push('recruit') })

    await sagaRecruitTroop({ player_id, city_id, troop_code, count })

    assert.deepStrictEqual(order, ['finish-building', 'finish-technology', 'recruit'])
  })

  it('propagates errors from finishBuildingUpgrade', async () => {
    ;(finishBuildingUpgrade as MockInstance).mockRejectedValue(new Error('finish building error'))

    await assert.rejects(() => sagaRecruitTroop({ player_id, city_id, troop_code, count }), /finish building error/)
    assert.strictEqual((finishTechnologyResearch as MockInstance).mock.calls.length, 0)
    assert.strictEqual((recruitTroop as MockInstance).mock.calls.length, 0)
  })

  it('propagates errors from finishTechnologyResearch', async () => {
    ;(finishTechnologyResearch as MockInstance).mockRejectedValue(new Error('finish technology error'))

    await assert.rejects(() => sagaRecruitTroop({ player_id, city_id, troop_code, count }), /finish technology error/)
    assert.strictEqual((recruitTroop as MockInstance).mock.calls.length, 0)
  })

  it('propagates errors from recruitTroop', async () => {
    ;(recruitTroop as MockInstance).mockRejectedValue(new Error('recruit error'))

    await assert.rejects(() => sagaRecruitTroop({ player_id, city_id, troop_code, count }), /recruit error/)
  })
})
