import { GenericCommand } from '#app/command/generic'
import { BuildingCode } from '#core/building/domain/constants'
import { BuildingEntity } from '#core/building/domain/entity'
import { BuildingService } from '#core/building/domain/service'
import { CityEntity } from '#core/city/domain/entity'
import { CityService } from '#core/city/domain/service'
import { LevelCostEntity } from '#core/pricing/domain/entities/level'
import { TechnologyCode } from '#core/technology/domain/constants'

export interface UpgradeBuildingRequest {
  player_id: string
  city_id: string
  building_code: BuildingCode
}

interface UpgradeBuildingExec {
  player_id: string
  city: CityEntity
  is_building_in_progress: boolean
  building_costs: LevelCostEntity
  architecture_level: number
  building: BuildingEntity
}

interface UpgradeBuildingSave {
  city: CityEntity
  building: BuildingEntity
}

export class UpgradeBuildingCommand extends GenericCommand<
  UpgradeBuildingRequest,
  UpgradeBuildingExec,
  UpgradeBuildingSave
> {
  async fetch({
    player_id,
    city_id,
    building_code,
  }: UpgradeBuildingRequest): Promise<UpgradeBuildingExec> {
    const [
      architecture_technology,
      city,
      building,
      is_building_in_progress
    ] = await Promise.all([
      this.repository.technology.findOneOrThrow({
        player_id,
        code: TechnologyCode.ARCHITECTURE
      }),
      this.repository.city.findByIdOrThrow(city_id),
      this.repository.building.findOneOrThrow({
        city_id,
        code: building_code
      }),
      this.repository.building.exists({
        city_id,
        upgrade_at: {
          $exists: true,
          $ne: null
        }
      })
    ])

    console.log({
      level: building.level,
      code: building_code
    })
    const building_costs = await this.repository.level_cost.getNextLevelCost({
      level: building.level,
      code: building_code
    })

    return {
      architecture_level: architecture_technology.level,
      building_costs,
      building,
      city,
      is_building_in_progress,
      player_id
    }
  }
  exec({
    architecture_level,
    building_costs,
    building,
    city,
    is_building_in_progress,
    player_id
  }: UpgradeBuildingExec): UpgradeBuildingSave {
    const city_service = new CityService()
    const building_service = new BuildingService()
    const updated_city = city_service.purchase({
      player_id,
      city,
      cost: building_costs.resource
    })
    const updated_building = building_service.launchUpgrade({
      building,
      is_building_in_progress,
      duration: building_costs.duration,
      architecture_level
    })

    return {
      city: updated_city,
      building: updated_building
    }
  }
  async save({
    city,
    building
  }: UpgradeBuildingSave): Promise<void> {
    await Promise.all([
      this.repository.city.updateOne(city),
      this.repository.building.updateOne(building)
    ])
  }

}
