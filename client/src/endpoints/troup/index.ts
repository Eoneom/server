import { Fetcher } from '../../fetcher'
import {
  TroupBaseRequest,
  TroupBaseResponse
} from './movement/base'
import {
  TroupCancelRequest,
  TroupCancelResponse
} from './cancel'
import {
  TroupExploreRequest,
  TroupExploreResponse
} from './movement/explore'
import { TroupFinishMovementResponse } from './movement/finish'
import { TroupListCityRequest } from './list/city'
import { TroupListMovementResponse } from './movement/list'
import {
  TroupProgressRecruitRequest,
  TroupProgressRecruitResponse
} from './progress-recruit'
import {
  TroupRecruitRequest,
  TroupRecruitResponse
} from './recruit'
import { TroupListOutpostRequest } from './list/outpost'
import { TroupListResponse } from './list/shared'

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

  public async listCity(token: string, { city_id }: TroupListCityRequest): Promise<TroupListResponse> {
    return this.fetcher.get(`/city/${city_id}/troup`, { token })
  }

  public async listOutpost(token: string, { outpost_id }: TroupListOutpostRequest): Promise<TroupListResponse> {
    return this.fetcher.get(`/outpost/${outpost_id}/troup`, { token })
  }

  public async listMovement(token: string): Promise<TroupListMovementResponse> {
    return this.fetcher.get('/troup/movement', { token })
  }

  public async finishMovement(token: string): Promise<TroupFinishMovementResponse> {
    return this.fetcher.put('/troup/movement/finish', { token })
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

  public async base(token: string, body: TroupBaseRequest): Promise<TroupBaseResponse> {
    return this.fetcher.put('/troup/base', {
      body,
      token
    })
  }
}
