import { Fetcher } from '../../fetcher'
import { BuildingUpgradeRequest, BuildingUpgradeResponse } from './upgrade'

export class BuildingEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public async upgrade(body: BuildingUpgradeRequest): Promise<BuildingUpgradeResponse> {
    return this.fetcher.put('/building/upgrade', body)
  }
}
