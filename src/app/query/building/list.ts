import { GenericQuery } from '#query/generic'
import { BuildingEntity } from '#core/building/entity'
import { CityError } from '#core/city/error'
import { BuildingService } from '#core/building/service'

export interface ListBuildingRequest {
  city_id: string,
  player_id: string
}

export interface ListBuildingQueryResponse {
  buildings: BuildingEntity[],
}

export class BuildingListQuery extends GenericQuery<ListBuildingRequest, ListBuildingQueryResponse> {
  async get({
    city_id,
    player_id
  }: ListBuildingRequest): Promise<ListBuildingQueryResponse> {
    const city = await this.repository.city.get(city_id)
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const buildings = await this.repository.building.list({ city_id })

    return { buildings: BuildingService.sortBuildings({ buildings }) }
  }
}
