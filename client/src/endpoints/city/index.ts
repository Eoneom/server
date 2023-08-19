import { Fetcher } from '../../fetcher'
import { CityListResponse } from './list'

export class CityEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  list(token: string): Promise<CityListResponse> {
    return this.fetcher.get('/city', { token })
  }
}
