import { Fetcher } from '../../fetcher'
import { TechnologyListResponse } from './list'
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

  public async list(token: string): Promise<TechnologyListResponse> {
    return this.fetcher.get('/player/technology', { token })
  }
}
