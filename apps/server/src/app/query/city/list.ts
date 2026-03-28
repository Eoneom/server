import { GenericQuery } from '#query/generic'
import { CityEntity } from '#core/city/entity'

export interface CityListQueryRequest {
  player_id: string
}

export interface CityListQueryResponse {
  cities: CityEntity[]
}

export class CityListQuery extends GenericQuery<CityListQueryRequest, CityListQueryResponse> {
  constructor() {
    super({ name: 'building:list' })
  }

  protected async get({ player_id }: CityListQueryRequest): Promise<CityListQueryResponse> {
    const cities = await this.repository.city.list({ player_id })

    return { cities }
  }
}
