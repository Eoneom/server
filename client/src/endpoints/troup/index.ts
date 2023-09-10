import { Fetcher } from '../../fetcher'
import {
  TroupCancelRequest,
  TroupCancelResponse
} from './cancel'
import {
  TroupExploreRequest,
  TroupExploreResponse
} from './explore'
import {
  TroupListRequest,
  TroupListResponse
} from './list'
import {
  TroupProgressRecruitRequest,
  TroupProgressRecruitResponse
} from './progress-recruit'
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

  public async progressRecruit(token: string, body: TroupProgressRecruitRequest): Promise<TroupProgressRecruitResponse> {
    return this.fetcher.put('/troup/recruit/progress', {
      body,
      token
    })
  }

  public async list(token: string, { city_id }: TroupListRequest): Promise<TroupListResponse> {
    return this.fetcher.get(`/city/${city_id}/troup`, { token })
  }

  public async cancel(token: string, body: TroupCancelRequest): Promise<TroupCancelResponse> {
    return this.fetcher.put('/troup/cancel', {
      body,
      token
    })
  }

  public async explore(token: string, body: TroupExploreRequest): Promise<TroupExploreResponse> {
    return this.fetcher.put('/troup/explore', {
      body,
      token
    })
  }
}
