import {
  vi, type MockInstance 
} from 'vitest'
import assert from 'assert'
import { sagaRefreshGameState } from './refresh-state'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'
import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { cityGather } from '#app/command/city/gather'
import { sagaFinishMovement } from '#app/saga/finish/movement'
import { BuildingCode } from '#core/building/constant/code'

vi.mock('#app/command/technology/finish-research')
vi.mock('#app/command/building/finish-upgrade')
vi.mock('#app/command/city/gather')
vi.mock('#app/saga/finish/movement')

describe('sagaRefreshGameState', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const upgraded_at = 2000

  beforeEach(() => {
    vi.clearAllMocks()
    ;(finishTechnologyResearch as MockInstance).mockResolvedValue(undefined)
    ;(sagaFinishMovement as MockInstance).mockResolvedValue(undefined)
    ;(finishBuildingUpgrade as MockInstance).mockResolvedValue(null)
    ;(cityGather as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls finishTechnologyResearch with player_id', async () => {
    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((finishTechnologyResearch as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishTechnologyResearch as MockInstance).mock.calls[0][0], { player_id })
  })

  it('calls sagaFinishMovement with player_id', async () => {
    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((sagaFinishMovement as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((sagaFinishMovement as MockInstance).mock.calls[0][0], { player_id })
  })

  it('calls finishBuildingUpgrade with player_id and city_id', async () => {
    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((finishBuildingUpgrade as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishBuildingUpgrade as MockInstance).mock.calls[0][0], {
      player_id,
      city_id 
    })
  })

  it('calls cityGather once with now() when no upgrade is in progress', async () => {
    (finishBuildingUpgrade as MockInstance).mockResolvedValue(null)

    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((cityGather as MockInstance).mock.calls.length, 1)
    const call = (cityGather as MockInstance).mock.calls[0][0]
    assert.strictEqual(call.player_id, player_id)
    assert.strictEqual(call.city_id, city_id)
    assert.ok(typeof call.gather_at_time === 'number')
  })

  it('calls cityGather twice when upgrade result is a production building', async () => {
    (finishBuildingUpgrade as MockInstance).mockResolvedValue({
      code: BuildingCode.MUSHROOM_FARM,
      upgraded_at
    })

    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((cityGather as MockInstance).mock.calls.length, 2)
    const first_call = (cityGather as MockInstance).mock.calls[0][0]
    assert.deepStrictEqual(first_call, {
      player_id,
      city_id,
      gather_at_time: upgraded_at 
    })
  })

  it('calls cityGather twice when upgrade result is a warehouse building', async () => {
    (finishBuildingUpgrade as MockInstance).mockResolvedValue({
      code: BuildingCode.PLASTIC_WAREHOUSE,
      upgraded_at
    })

    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((cityGather as MockInstance).mock.calls.length, 2)
    const first_call = (cityGather as MockInstance).mock.calls[0][0]
    assert.deepStrictEqual(first_call, {
      player_id,
      city_id,
      gather_at_time: upgraded_at 
    })
  })

  it('calls cityGather once when upgrade result is a non-production/warehouse building', async () => {
    (finishBuildingUpgrade as MockInstance).mockResolvedValue({
      code: BuildingCode.RESEARCH_LAB,
      upgraded_at
    })

    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.strictEqual((cityGather as MockInstance).mock.calls.length, 1)
  })

  it('calls commands in order: finishTechnologyResearch, sagaFinishMovement, finishBuildingUpgrade, cityGather', async () => {
    const order: string[] = []
    ;(finishTechnologyResearch as MockInstance).mockImplementation(async () => {
      order.push('finish-technology') 
    })
    ;(sagaFinishMovement as MockInstance).mockImplementation(async () => {
      order.push('finish-movement') 
    })
    ;(finishBuildingUpgrade as MockInstance).mockImplementation(async () => {
      order.push('finish-building'); return null 
    })
    ;(cityGather as MockInstance).mockImplementation(async () => {
      order.push('city-gather') 
    })

    await sagaRefreshGameState({
      player_id,
      city_id 
    })

    assert.deepStrictEqual(order, [
      'finish-technology',
      'finish-movement',
      'finish-building',
      'city-gather' 
    ])
  })
})
