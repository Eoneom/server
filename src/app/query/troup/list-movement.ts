import { GenericQuery } from '#query/generic'
import { MovementEntity } from '#core/troup/movement.entity'
import { CityError } from '#core/city/error'

export interface TroupListMovementQueryRequest {
  city_id: string,
  player_id: string
}

export interface TroupListMovementQueryResponse {
  movements: MovementEntity[],
}

export class TroupListMovementQuery extends GenericQuery<TroupListMovementQueryRequest, TroupListMovementQueryResponse> {
  async get({
    city_id,
    player_id
  }: TroupListMovementQueryRequest): Promise<TroupListMovementQueryResponse> {
    const city = await this.repository.city.get(city_id)
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const movements = await this.repository.movement.listInCity({ city_id })
    return { movements }
  }
}
