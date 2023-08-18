import { Factory } from '#app/factory'
import { BuildingCode } from '#core/building/constants'
import { BuildingService } from '#core/building/service'
import { RequirementService } from '#core/requirement/service'
import { TechnologyCode } from '#core/technology/constants'
import { CellEntity } from '#core/world/entity'
import { WorldService } from '#core/world/service'
import { Resource } from '#shared/resource'

export class AppService {
  static async getCityEarningsBySecond({ city_id }: { city_id: string }): Promise<Resource> {
    const repository = Factory.getRepository()
    const [
      mushroom_farm_level,
      recycling_plant_level
    ] = await Promise.all([
      repository.building.getLevel({
        city_id,
        code: BuildingCode.MUSHROOM_FARM
      }),
      repository.building.getLevel({
        city_id,
        code: BuildingCode.RECYCLING_PLANT
      })
    ])

    return BuildingService.getEarningsBySecond({
      recycling_plant_level,
      mushroom_farm_level
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

  static async findCityFirstCell(): Promise<CellEntity> {
    const repository = Factory.getRepository()
    for (;;) {
      const random_coordinates = WorldService.getRandomCoordinates()
      const cell = await repository.world.getCell({ coordinates: random_coordinates })
      if (!cell.isAssigned()) {
        return cell
      }
    }
  }
}
