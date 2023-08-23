import { Fetcher } from '../../fetcher'
import {
  TroupListRequest,
  TroupListResponse
} from './list'
import {
  TroupRecruitRequest,
  TroupRecruitResponse
} from './recruit'

export class TroupEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public async recruit(token: string, body: TroupRecruitRequest): Promise<TroupRecruitResponse> {
    return this.fetcher.put('/troup/recruit', {
      body,
      token
    })
  }

  public async list(token: string, { city_id }: TroupListRequest): Promise<TroupListResponse> {
    return this.fetcher.get(`/city/${city_id}/troup`, { token })
  }
}
