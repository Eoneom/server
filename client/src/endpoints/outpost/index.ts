import { Fetcher } from '../../fetcher'
import {
  OutpostGetRequest,
  OutpostGetResponse
} from './get'
import { OutpostListResponse } from './list'

export class OutpostEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  get(token: string, body: OutpostGetRequest): Promise<OutpostGetResponse> {
    return this.fetcher.get(`/outpost/${body.outpost_id}`, { token })
  }

  list(token: string): Promise<OutpostListResponse> {
    return this.fetcher.get('/outpost', { token })
  }
}
