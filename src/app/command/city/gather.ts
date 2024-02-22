import { GenericCommand } from '#app/command/generic'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { CellEntity } from '#core/world/cell.entity'
import { ProductionBuildingLevels } from '#modules/resource/constant/production'
import { WarehouseBuildingLevels } from '#modules/resource/constant/warehouse-capacity'
import { ResourceService } from '#modules/resource/service'

interface CityGatherRequest {
  city_id: string
  player_id: string
  gather_at_time: number
}

interface CityGatherExec {
  city: CityEntity
  gather_at_time: number
  player_id: string
  cell: CellEntity
  production_building_levels: ProductionBuildingLevels
  warehouse_building_levels: WarehouseBuildingLevels
}

interface CityGatherSave {
  updated_city: CityEntity
  is_updated: boolean
}

export class CityGatherCommand extends GenericCommand<
  CityGatherRequest,
  CityGatherExec,
  CityGatherSave
> {
  constructor() {
    super({ name:'city:gather' })
  }

  async fetch({
    city_id,
    player_id,
    gather_at_time
  }: CityGatherRequest): Promise<CityGatherExec> {
    const [
      city,
      cell,
      production_building_levels,
      warehouse_building_levels
    ] = await Promise.all([
      this.repository.city.get(city_id),
      this.repository.cell.getCityCell({ city_id }),
      this.repository.building.getProductionLevels(),
      this.repository.building.getWarehouseLevels()
    ])

    return {
      city,
      player_id,
      gather_at_time,
      cell,
      production_building_levels,
      warehouse_building_levels
    }
  }

  exec({
    city,
    player_id,
    gather_at_time,
    cell,
    production_building_levels,
    warehouse_building_levels,
  }: CityGatherExec): CityGatherSave {
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const {
      updated_city,
      is_updated
    } = ResourceService.gather({
      city,
      cell,
      production_building_levels,
      warehouse_building_levels,
      gather_at_time
    })

    return {
      updated_city: is_updated ? updated_city : city,
      is_updated
    }
  }

  async save({
    updated_city,
    is_updated
  }: CityGatherSave) {
    if (!is_updated) {
      return
    }

    await this.repository.city.updateOne(updated_city)
  }
}
