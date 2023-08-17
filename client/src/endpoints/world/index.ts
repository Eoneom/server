import { Fetcher } from '../../fetcher'
import { WorldGetSectorResponse } from './get-sector'

export class WorldEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public async getSector(token: string, body: { sector: number}): Promise<WorldGetSectorResponse> {
    return this.fetcher.get(`/sector/${body.sector}`, { token })
  }
}
