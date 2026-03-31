import assert from 'assert'
import { sagaUpgradeBuilding } from './upgrade-building'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'
import { upgradeBuilding } from '#app/command/building/upgrade'
import { BuildingCode } from '#core/building/constant/code'

jest.mock('#app/command/technology/finish-research')
jest.mock('#app/command/building/upgrade')

describe('sagaUpgradeBuilding', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const building_code = BuildingCode.RESEARCH_LAB

  beforeEach(() => {
    jest.clearAllMocks()
    ;(finishTechnologyResearch as jest.Mock).mockResolvedValue(undefined)
    ;(upgradeBuilding as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls finishTechnologyResearch with player_id', async () => {
    await sagaUpgradeBuilding({ player_id, city_id, building_code })

    assert.strictEqual((finishTechnologyResearch as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishTechnologyResearch as jest.Mock).mock.calls[0][0], { player_id })
  })

  it('calls upgradeBuilding with correct args', async () => {
    await sagaUpgradeBuilding({ player_id, city_id, building_code })

    assert.strictEqual((upgradeBuilding as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((upgradeBuilding as jest.Mock).mock.calls[0][0], { player_id, city_id, building_code })
  })

  it('calls finishTechnologyResearch before upgradeBuilding', async () => {
    const order: string[] = []
    ;(finishTechnologyResearch as jest.Mock).mockImplementation(async () => { order.push('finish') })
    ;(upgradeBuilding as jest.Mock).mockImplementation(async () => { order.push('upgrade') })

    await sagaUpgradeBuilding({ player_id, city_id, building_code })

    assert.deepStrictEqual(order, ['finish', 'upgrade'])
  })

  it('propagates errors from finishTechnologyResearch', async () => {
    ;(finishTechnologyResearch as jest.Mock).mockRejectedValue(new Error('finish error'))

    await assert.rejects(() => sagaUpgradeBuilding({ player_id, city_id, building_code }), /finish error/)
    assert.strictEqual((upgradeBuilding as jest.Mock).mock.calls.length, 0)
  })

  it('propagates errors from upgradeBuilding', async () => {
    ;(upgradeBuilding as jest.Mock).mockRejectedValue(new Error('upgrade error'))

    await assert.rejects(() => sagaUpgradeBuilding({ player_id, city_id, building_code }), /upgrade error/)
  })
})
