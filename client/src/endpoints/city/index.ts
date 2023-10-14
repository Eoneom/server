import { Fetcher } from '../../fetcher'
import {
  CityGatherRequest,
  CityGatherResponse
} from './gather'
import {
  CityGetRequest,
  CityGetResponse
} from './get'
import { CityListResponse } from './list'

export class CityEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  get(token: string, { city_id }: CityGetRequest): Promise<CityGetResponse> {
    return this.fetcher.get(`/city/${city_id}`, { token })
  }

  list(token: string): Promise<CityListResponse> {
    return this.fetcher.get('/city', { token })
  }

  gather(token: string, body: CityGatherRequest): Promise<CityGatherResponse> {
    return this.fetcher.put('/city/gather', {
      token,
      body
    })
  }
}
