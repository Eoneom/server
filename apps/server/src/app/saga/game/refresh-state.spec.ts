import assert from 'assert'
import { sagaRefreshGameState } from './refresh-state'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'
import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { cityGather } from '#app/command/city/gather'
import { sagaFinishMovement } from '#app/saga/finish/movement'
import { BuildingCode } from '#core/building/constant/code'

jest.mock('#app/command/technology/finish-research')
jest.mock('#app/command/building/finish-upgrade')
jest.mock('#app/command/city/gather')
jest.mock('#app/saga/finish/movement')

describe('sagaRefreshGameState', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const upgraded_at = 2000

  beforeEach(() => {
    jest.clearAllMocks()
    ;(finishTechnologyResearch as jest.Mock).mockResolvedValue(undefined)
    ;(sagaFinishMovement as jest.Mock).mockResolvedValue(undefined)
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue(null)
    ;(cityGather as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls finishTechnologyResearch with player_id', async () => {
    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((finishTechnologyResearch as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishTechnologyResearch as jest.Mock).mock.calls[0][0], { player_id })
  })

  it('calls sagaFinishMovement with player_id', async () => {
    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((sagaFinishMovement as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((sagaFinishMovement as jest.Mock).mock.calls[0][0], { player_id })
  })

  it('calls finishBuildingUpgrade with player_id and city_id', async () => {
    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((finishBuildingUpgrade as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishBuildingUpgrade as jest.Mock).mock.calls[0][0], { player_id, city_id })
  })

  it('calls cityGather once with now() when no upgrade is in progress', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue(null)

    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 1)
    const call = (cityGather as jest.Mock).mock.calls[0][0]
    assert.strictEqual(call.player_id, player_id)
    assert.strictEqual(call.city_id, city_id)
    assert.ok(typeof call.gather_at_time === 'number')
  })

  it('calls cityGather twice when upgrade result is a production building', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue({
      code: BuildingCode.MUSHROOM_FARM,
      upgraded_at
    })

    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 2)
    const first_call = (cityGather as jest.Mock).mock.calls[0][0]
    assert.deepStrictEqual(first_call, { player_id, city_id, gather_at_time: upgraded_at })
  })

  it('calls cityGather twice when upgrade result is a warehouse building', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue({
      code: BuildingCode.PLASTIC_WAREHOUSE,
      upgraded_at
    })

    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 2)
    const first_call = (cityGather as jest.Mock).mock.calls[0][0]
    assert.deepStrictEqual(first_call, { player_id, city_id, gather_at_time: upgraded_at })
  })

  it('calls cityGather once when upgrade result is a non-production/warehouse building', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue({
      code: BuildingCode.RESEARCH_LAB,
      upgraded_at
    })

    await sagaRefreshGameState({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 1)
  })

  it('calls commands in order: finishTechnologyResearch, sagaFinishMovement, finishBuildingUpgrade, cityGather', async () => {
    const order: string[] = []
    ;(finishTechnologyResearch as jest.Mock).mockImplementation(async () => { order.push('finish-technology') })
    ;(sagaFinishMovement as jest.Mock).mockImplementation(async () => { order.push('finish-movement') })
    ;(finishBuildingUpgrade as jest.Mock).mockImplementation(async () => { order.push('finish-building'); return null })
    ;(cityGather as jest.Mock).mockImplementation(async () => { order.push('city-gather') })

    await sagaRefreshGameState({ player_id, city_id })

    assert.deepStrictEqual(order, ['finish-technology', 'finish-movement', 'finish-building', 'city-gather'])
  })
})
