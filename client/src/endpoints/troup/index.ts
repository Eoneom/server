import { Fetcher } from '../../fetcher'
import {
  TroupRecruitRequest, TroupRecruitResponse 
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
}
