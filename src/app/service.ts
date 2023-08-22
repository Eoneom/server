import { Factory } from '#adapter/factory'
import { BuildingCode } from '#core/building/constant'
import { BuildingService } from '#core/building/service'
import { CityService } from '#core/city/service'
import { RequirementService } from '#core/requirement/service'
import { TechnologyCode } from '#core/technology/constant'
import { CellEntity } from '#core/world/cell.entity'
import { WorldService } from '#core/world/service'
import { Resource } from '#shared/resource'

export class AppService {
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

  static async getTechnologyRequirementLevels({
    city_id,
    player_id,
    technology_code,
  }: {
    city_id: string,
    player_id: string
    technology_code: TechnologyCode
   }): Promise<{
    building_levels: Record<BuildingCode, number>,
    technology_levels: Record<TechnologyCode, number>
   }> {
    const repository = Factory.getRepository()
    const requirements = RequirementService.getTechnologyRequirement({ technology_code })
    const required_building_codes = requirements.buildings.map(requirement => requirement.code)
    const required_technology_codes = requirements.technologies.map(requirement => requirement.code)
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
      building_levels,
      technology_levels
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
}
