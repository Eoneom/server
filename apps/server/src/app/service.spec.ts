import { AppService, NEUTRAL_CELL_COEFFICIENTS } from '#app/service'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingService } from '#core/building/service'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'
import { Coordinates } from '#core/world/value/coordinates'

describe('AppService.getCityProductionBreakdown', () => {
  const city_id = 'city_1'
  const coordinates: Coordinates = {
    x: 1,
    y: 2,
    sector: 3
  }
  const resource_coefficient = {
    plastic: 0.85,
    mushroom: 1.1
  }
  const city_cell = CellEntity.create({
    id: 'cell_id',
    coordinates,
    type: CellType.LAKE,
    resource_coefficient
  })

  beforeEach(() => {
    const repository = {
      building: {
        getLevel: jest.fn().mockImplementation(({ code }: { code: BuildingCode }) => {
          if (code === BuildingCode.MUSHROOM_FARM) {
            return 2
          }
          if (code === BuildingCode.RECYCLING_PLANT) {
            return 1
          }
          return 0
        })
      },
      cell: {
        getCityCell: jest.fn().mockResolvedValue(city_cell)
      }
    } as unknown as Repository

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns same earnings_per_second as getCityEarningsBySecond', async () => {
    const [breakdown, earnings] = await Promise.all([
      AppService.getCityProductionBreakdown({ city_id }),
      AppService.getCityEarningsBySecond({ city_id })
    ])

    expect(breakdown.earnings_per_second).toEqual(earnings)
  })

  it('exposes cell coefficients and pre-cell rates from BuildingService', async () => {
    const breakdown = await AppService.getCityProductionBreakdown({ city_id })

    expect(breakdown.cell_resource_coefficient).toEqual(resource_coefficient)

    expect(breakdown.pre_cell_earnings_per_second.plastic).toBe(
      BuildingService.getEarningsBySecond({
        code: BuildingCode.RECYCLING_PLANT,
        level: 1,
        coefficients: NEUTRAL_CELL_COEFFICIENTS
      })
    )
    expect(breakdown.pre_cell_earnings_per_second.mushroom).toBe(
      BuildingService.getEarningsBySecond({
        code: BuildingCode.MUSHROOM_FARM,
        level: 2,
        coefficients: NEUTRAL_CELL_COEFFICIENTS
      })
    )

    expect(breakdown.earnings_per_second.plastic).toBe(
      BuildingService.getEarningsBySecond({
        code: BuildingCode.RECYCLING_PLANT,
        level: 1,
        coefficients: resource_coefficient
      })
    )
  })
})
