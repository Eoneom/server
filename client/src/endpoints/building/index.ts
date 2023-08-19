import { Fetcher } from '../../fetcher'
import {
  BuildingCancelRequest,
  BuildingCancelResponse
} from './cancel'
import {
  BuildingListRequest,
  BuildingListResponse
} from './list'
import {
  BuildingUpgradeRequest,
  BuildingUpgradeResponse
} from './upgrade'

export class BuildingEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public async upgrade(token: string, body: BuildingUpgradeRequest): Promise<BuildingUpgradeResponse> {
    return this.fetcher.put('/building/upgrade', {
      body,
      token
    })
  }

  public async list(token: string, { city_id }: BuildingListRequest): Promise<BuildingListResponse> {
    return this.fetcher.get(`/city/${city_id}/building`, { token })
  }

  public async cancel(token: string, body: BuildingCancelRequest): Promise<BuildingCancelResponse> {
    return this.fetcher.put('/building/cancel', {
      body,
      token
    })
  }
}
