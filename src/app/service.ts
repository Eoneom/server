import { Factory } from '#adapter/factory'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingService } from '#core/building/service'
import { CityService } from '#core/city/service'
import {
  Levels,
  RequirementService
} from '#core/requirement/service'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TechnologyCode } from '#core/technology/constant'
import { TroupCode } from '#core/troup/constant'
import { CellEntity } from '#core/world/cell.entity'
import { WorldService } from '#core/world/service'
import { Coordinates } from '#core/world/value/coordinates'
import { Resource } from '#shared/resource'

export class AppService {
  static async getExploredCellIds({ coordinates }: { coordinates: Coordinates }): Promise<string[]> {
    const repository = Factory.getRepository()
    const cell = await repository.cell.getCell({ coordinates })
    return [ cell.id ]
  }

  static async getCityMaximumBuildingLevels({ city_id }: { city_id: string }): Promise<number> {
    const repository = Factory.getRepository()
    const city_cells_count = await repository.cell.getCityCellsCount({ city_id })
    return CityService.getMaximumBuildingLevels({ city_cells_count })
  }

  static async getCityEarningsBySecond({ city_id }: { city_id: string }): Promise<Resource> {
    const repository = Factory.getRepository()
    const [
      mushroom_farm_level,
      recycling_plant_level,
      city_cell
    ] = await Promise.all([
      repository.building.getLevel({
        city_id,
        code: BuildingCode.MUSHROOM_FARM
      }),
      repository.building.getLevel({
        city_id,
        code: BuildingCode.RECYCLING_PLANT
      }),
      repository.cell.getCityCell({ city_id })
    ])

    const coefficients = city_cell.resource_coefficient

    return BuildingService.getEarningsBySecond({
      recycling_plant_level,
      plastic_coefficient: coefficients.plastic,
      mushroom_farm_level,
      mushroom_coefficient: coefficients.mushroom
    })
  }

  static async getBuildingRequirementLevels({
    city_id,
    player_id,
    building_code
  }: {
    city_id: string
    player_id: string
    building_code: BuildingCode
  }): Promise<Levels> {
    const requirement = RequirementService.getBuildingRequirement({ building_code })
    return this.getRequirementLevels({
      city_id,
      player_id,
      requirement
    })
  }

  static async getTechnologyRequirementLevels({
    city_id,
    player_id,
    technology_code,
  }: {
    city_id: string,
    player_id: string
    technology_code: TechnologyCode
   }): Promise<Levels> {
    const requirement = RequirementService.getTechnologyRequirement({ technology_code })
    return this.getRequirementLevels({
      city_id,
      player_id,
      requirement
    })
  }

  static async getTroupRequirementLevels({
    city_id,
    player_id,
    troup_code
  }: {
    city_id: string
    player_id: string
    troup_code: TroupCode
  }): Promise<Levels> {
    const requirement = RequirementService.getTroupRequirement({ troup_code })
    return this.getRequirementLevels({
      city_id,
      player_id,
      requirement
    })
  }

  private static async getRequirementLevels({
    city_id,
    player_id,
    requirement
  }: {
    city_id: string
    player_id: string
    requirement: RequirementValue
  }): Promise<Levels> {
    const repository = Factory.getRepository()
    const required_building_codes = requirement.buildings.map(req => req.code)
    const required_technology_codes = requirement.technologies.map(req => req.code)
    const [
      buildings,
      technologies
    ] = await Promise.all([
      repository.building.list({
        city_id,
        codes: required_building_codes
      }),
      repository.technology.list({
        player_id,
        codes: required_technology_codes
      })
    ])

    const building_levels: Record<BuildingCode, number> = buildings.reduce((acc, building) => {
      return {
        ...acc,
        [building.code]: building.level
      }
    }, {} as Record<BuildingCode, number>)

    const technology_levels: Record<TechnologyCode, number> = technologies.reduce((acc, technology) => {
      return {
        ...acc,
        [technology.code]: technology.level
      }
    }, {} as Record<TechnologyCode, number>)

    return {
      building: building_levels,
      technology: technology_levels
    }
  }

  static async selectCityFirstCell(): Promise<CellEntity> {
    const repository = Factory.getRepository()
    for (;;) {
      const random_coordinates = WorldService.getRandomCoordinates()
      const cell = await repository.cell.getCell({ coordinates: random_coordinates })
      if (!cell.isAssigned()) {
        return cell
      }
    }
  }

  static async getCellsAround({ coordinates }: { coordinates: Coordinates }): Promise<CellEntity[]> {
    const repository = Factory.getRepository()
    const all_coordinates: Coordinates[] = [
      {
        x: coordinates.x - 1,
        y: coordinates.y,
        sector: coordinates.sector
      },
      {
        x: coordinates.x,
        y: coordinates.y - 1,
        sector: coordinates.sector
      },
      {
        x: coordinates.x + 1,
        y: coordinates.y,
        sector: coordinates.sector
      },
      {
        x: coordinates.x,
        y: coordinates.y + 1,
        sector: coordinates.sector
      }
    ]

    return Promise.all(all_coordinates.map(cell_coordinates => repository.cell.getCell({ coordinates: cell_coordinates })))
  }
}
