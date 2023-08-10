import { GenericCommand } from '#app/command/generic'
import { BuildingEntity } from '#core/building/entity'
import { BuildingErrors } from '#core/building/errors'
import { CityEntity } from '#core/city/entity'
import { CityErrors } from '#core/city/errors'
import { PricingService } from '#core/pricing/service'

interface CancelBuildingRequest {
  city_id: string
  player_id: string
}

interface CancelBuildingExec {
  city: CityEntity
  player_id: string
  building: BuildingEntity | null
}

interface CancelBuildingSave {
  building: BuildingEntity
  city: CityEntity
}

export class CancelBuildingCommand extends GenericCommand<
  CancelBuildingRequest,
  CancelBuildingExec,
  CancelBuildingSave
> {
  async fetch({
    city_id,
    player_id
  }: CancelBuildingRequest): Promise<CancelBuildingExec> {
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
  }: CancelBuildingExec): CancelBuildingSave {
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityErrors.NOT_OWNER)
    }

    if (!building) {
      throw new Error(BuildingErrors.NOT_IN_PROGRESS)
    }

    const building_costs = PricingService.getBuildingLevelCost({
      code: building.code,
      level: building.level,
      architecture_level: 0
    })

    const plastic = Math.round(building_costs.resource.plastic/2)
    const mushroom = Math.round(building_costs.resource.mushroom/2)

    const updated_city = city.refund({
      plastic,
      mushroom
    })

    return {
      building: building.cancel(),
      city: updated_city
    }
  }
  async save({
    building,
    city
  }: CancelBuildingSave): Promise<void> {
    await Promise.all([
      this.repository.building.updateOne(building),
      this.repository.city.updateOne(city)
    ])
  }
}
