import { GenericCommand } from '#command/generic'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { PricingService } from '#core/pricing/service'

interface BuildingCancelRequest {
  city_id: string
  player_id: string
}

interface BuildingCancelExec {
  city: CityEntity
  player_id: string
  building: BuildingEntity | null
}

interface BuildingCancelSave {
  building: BuildingEntity
  city: CityEntity
}

export class BuildingCancelCommand extends GenericCommand<
  BuildingCancelRequest,
  BuildingCancelExec,
  BuildingCancelSave
> {
  async fetch({
    city_id,
    player_id
  }: BuildingCancelRequest): Promise<BuildingCancelExec> {
    const [
      city,
      building
    ] = await Promise.all([
      this.repository.city.get(city_id),
      this.repository.building.getInProgress({ city_id })
    ])

    return {
      city,
      player_id,
      building
    }
  }
  exec({
    city,
    player_id,
    building
  }: BuildingCancelExec): BuildingCancelSave {
    if (!building) {
      throw new Error(BuildingError.NOT_IN_PROGRESS)
    }

    const building_costs = PricingService.getBuildingLevelCost({
      code: building.code,
      level: building.level,
      architecture_level: 0
    })

    const plastic = Math.round(building_costs.resource.plastic/2)
    const mushroom = Math.round(building_costs.resource.mushroom/2)

    const updated_city = CityService.refund({
      plastic,
      mushroom,
      player_id,
      city
    })

    return {
      building: building.cancel(),
      city: updated_city
    }
  }
  async save({
    building,
    city
  }: BuildingCancelSave): Promise<void> {
    await Promise.all([
      this.repository.building.updateOne(building),
      this.repository.city.updateOne(city)
    ])
  }
}
