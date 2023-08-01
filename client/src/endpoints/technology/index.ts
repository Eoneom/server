import { Fetcher } from '../../fetcher'
import {
  TechnologyListRequest, TechnologyListResponse
} from './list'
import {
  TechnologyResearchRequest, TechnologyResearchResponse
} from './research'

export class TechnologyEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public async research(token: string, body: TechnologyResearchRequest): Promise<TechnologyResearchResponse> {
    return this.fetcher.put('/technology/research', {
      body,
      token
    })
  }

  public async list(token: string, body: TechnologyListRequest): Promise<TechnologyListResponse> {
    return this.fetcher.get(`/city/${body.city_id}/technology`, { token })
  }
}
