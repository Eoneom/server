import { Fetcher } from '../../fetcher'
import {
  CityGatherRequest,
  CityGatherResponse
} from './gather'
import { CityListResponse } from './list'

export class CityEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
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