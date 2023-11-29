import { Fetcher } from '../../fetcher'
import {
  TroupBaseRequest,
  TroupBaseResponse
} from './base'
import {
  TroupCancelRequest,
  TroupCancelResponse
} from './cancel'
import {
  TroupExploreRequest,
  TroupExploreResponse
} from './explore'
import {
  TroupFinishMovementRequest,
  TroupFinishMovementResponse
} from './finish-movement'
import { TroupListCityRequest } from './list/city'
import { TroupListMovementResponse } from './list-movement'
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

  public async finishMovement(token: string, { movement_id }: TroupFinishMovementRequest): Promise<TroupFinishMovementResponse> {
    return this.fetcher.put(`/troup/movement/${movement_id}/finish`, { token })
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
