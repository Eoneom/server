import { GenericCommand } from '#app/command/generic'
import { BuildingCode } from '#core/building/constants'
import { BuildingEntity } from '#core/building/entity'
import { BuildingService } from '#core/building/service'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { PricingService } from '#core/pricing/service'
import { TechnologyCode } from '#core/technology/constants'
import assert from 'assert'

export interface UpgradeBuildingRequest {
  player_id: string
  city_id: string
  building_code: BuildingCode
}

interface UpgradeBuildingExec {
  player_id: string
  city: CityEntity
  is_building_in_progress: boolean
  architecture_level: number
  building: BuildingEntity
}

interface UpgradeBuildingSave {
  city: CityEntity
  building: BuildingEntity
}

export interface UpgradeBuildingResponse {
  upgrade_at: number
}

export class UpgradeBuildingCommand extends GenericCommand<
  UpgradeBuildingRequest,
  UpgradeBuildingExec,
  UpgradeBuildingSave,
  UpgradeBuildingResponse
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

    return {
      architecture_level: architecture_technology.level,
      building,
      city,
      is_building_in_progress,
      player_id
    }
  }
  exec({
    architecture_level,
    building,
    city,
    is_building_in_progress,
    player_id
  }: UpgradeBuildingExec): UpgradeBuildingSave {
    const building_costs = PricingService.getBuildingLevelCost({
      level: building.level + 1,
      code: building.code,
      architecture_level
    })
    const updated_city = CityService.purchase({
      player_id,
      city,
      cost: building_costs.resource
    })
    const updated_building = BuildingService.launchUpgrade({
      building,
      is_building_in_progress,
      duration: building_costs.duration,
    })

    return {
      city: updated_city,
      building: updated_building
    }
  }
  async save({
    city,
    building
  }: UpgradeBuildingSave): Promise<UpgradeBuildingResponse> {
    await Promise.all([
      this.repository.city.updateOne(city),
      this.repository.building.updateOne(building)
    ])

    assert(building.upgrade_at)
    return { upgrade_at: building.upgrade_at }
  }

}
