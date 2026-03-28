import { Fetcher } from '../../fetcher'
import {
  TroupCancelRequest,
  TroupCancelResponse
} from './cancel'
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
import {
  TroupGetMovementRequest,
  TroupGetMovementResponse
} from './movement/get'
import {
  TroupMovementEstimateRequest,
  TroupMovementEstimateResponse
} from './movement/estimate'
import {
  TroupMovementCreateResponse,
  TroupMovementCreateRequest
} from './movement/create'
import {
  TroupGetRequest,
  TroupGetResponse
} from './get'

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

  public async get(token: string, { troup_id }: TroupGetRequest): Promise<TroupGetResponse> {
    return this.fetcher.get(`/troup/${troup_id}`, { token })
  }

  public async createMovement(token: string, body: TroupMovementCreateRequest): Promise<TroupMovementCreateResponse> {
    return this.fetcher.post('/troup/movement', {
      token,
      body
    })
  }

  public async listMovement(token: string): Promise<TroupListMovementResponse> {
    return this.fetcher.get('/troup/movement', { token })
  }

  public async getMovement(token: string, { movement_id }: TroupGetMovementRequest): Promise<TroupGetMovementResponse> {
    return this.fetcher.get(`/troup/movement/${movement_id}`, { token })
  }

  public async finishMovement(token: string): Promise<TroupFinishMovementResponse> {
    return this.fetcher.put('/troup/movement/finish', { token })
  }

  public async estimateMovement(token: string, body: TroupMovementEstimateRequest): Promise<TroupMovementEstimateResponse> {
    return this.fetcher.post('/troup/movement/estimate', {
      token,
      body
    })
  }

  public async cancel(token: string, body: TroupCancelRequest): Promise<TroupCancelResponse> {
    return this.fetcher.put('/troup/cancel', {
      body,
      token
    })
  }
}
