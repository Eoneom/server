import { AppService } from '#app/service'
import { GenericCommand } from '#command/generic'
import { BuildingCode } from '#core/building/constant'
import { BuildingEntity } from '#core/building/entity'
import { BuildingService } from '#core/building/service'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { CityService } from '#core/city/service'
import { PricingService } from '#core/pricing/service'
import { TechnologyCode } from '#core/technology/constant'
import assert from 'assert'

export interface BuildingUpgradeRequest {
  player_id: string
  city_id: string
  building_code: BuildingCode
}

export interface BuildingUpgradeExec {
  player_id: string
  city: CityEntity
  is_building_in_progress: boolean
  architecture_level: number
  maximum_building_levels: number
  total_building_levels: number
  building: BuildingEntity
}

interface BuildingUpgradeSave {
  city: CityEntity
  building: BuildingEntity
}

export interface BuildingUpgradeResponse {
  upgrade_at: number
}

export class BuildingUpgradeCommand extends GenericCommand<
  BuildingUpgradeRequest,
  BuildingUpgradeExec,
  BuildingUpgradeSave,
  BuildingUpgradeResponse
> {
  async fetch({
    player_id,
    city_id,
    building_code,
  }: BuildingUpgradeRequest): Promise<BuildingUpgradeExec> {
    const [
      architecture_technology,
      city,
      building,
      is_building_in_progress,
      maximum_building_levels,
      total_building_levels
    ] = await Promise.all([
      this.repository.technology.get({
        player_id,
        code: TechnologyCode.ARCHITECTURE
      }),
      this.repository.city.get(city_id),
      this.repository.building.get({
        city_id,
        code: building_code
      }),
      this.repository.building.isInProgress({ city_id }),
      AppService.getCityMaximumBuildingLevels({ city_id }),
      this.repository.building.getTotalLevels({ city_id })
    ])

    return {
      architecture_level: architecture_technology.level,
      building,
      city,
      is_building_in_progress,
      player_id,
      maximum_building_levels,
      total_building_levels
    }
  }
  exec({
    architecture_level,
    building,
    city,
    is_building_in_progress,
    total_building_levels,
    maximum_building_levels,
    player_id
  }: BuildingUpgradeExec): BuildingUpgradeSave {
    if (total_building_levels >= maximum_building_levels) {
      throw new Error(CityError.NOT_ENOUGH_SPACE)
    }
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
  }: BuildingUpgradeSave): Promise<BuildingUpgradeResponse> {
    await Promise.all([
      this.repository.city.updateOne(city),
      this.repository.building.updateOne(building)
    ])

    assert(building.upgrade_at)
    return { upgrade_at: building.upgrade_at }
  }

}
