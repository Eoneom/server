import assert from 'assert'
import { sagaFinishUpgrade } from './upgrade'
import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { cityGather } from '#app/command/city/gather'
import { BuildingCode } from '#core/building/constant/code'

jest.mock('#app/command/building/finish-upgrade')
jest.mock('#app/command/city/gather')

describe('sagaFinishUpgrade', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const upgraded_at = 1000

  beforeEach(() => {
    jest.clearAllMocks()
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue(null)
    ;(cityGather as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls finishBuildingUpgrade with correct args', async () => {
    await sagaFinishUpgrade({ player_id, city_id })

    assert.strictEqual((finishBuildingUpgrade as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishBuildingUpgrade as jest.Mock).mock.calls[0][0], { player_id, city_id })
  })

  it('does not call cityGather when there is no upgrade in progress', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue(null)

    await sagaFinishUpgrade({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 0)
  })

  it('calls cityGather with upgraded_at when upgrade result is a production building', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue({
      code: BuildingCode.MUSHROOM_FARM,
      upgraded_at
    })

    await sagaFinishUpgrade({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((cityGather as jest.Mock).mock.calls[0][0], { player_id, city_id, gather_at_time: upgraded_at })
  })

  it('calls cityGather with upgraded_at when upgrade result is a warehouse building', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue({
      code: BuildingCode.MUSHROOM_WAREHOUSE,
      upgraded_at
    })

    await sagaFinishUpgrade({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((cityGather as jest.Mock).mock.calls[0][0], { player_id, city_id, gather_at_time: upgraded_at })
  })

  it('does not call cityGather when upgrade result is a non-production/warehouse building', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue({
      code: BuildingCode.RESEARCH_LAB,
      upgraded_at
    })

    await sagaFinishUpgrade({ player_id, city_id })

    assert.strictEqual((cityGather as jest.Mock).mock.calls.length, 0)
  })
})
