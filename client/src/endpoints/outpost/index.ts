import { Fetcher } from '../../fetcher'
import { OutpostListResponse } from './list'

export class OutpostEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  list(token: string): Promise<OutpostListResponse> {
    return this.fetcher.get('/outpost', { token })
  }
}
