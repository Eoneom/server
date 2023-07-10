import { Fetcher } from '../../fetcher'
import { RefreshRequest, RefreshResponse } from './refresh'
import { SignupRequest, SignupResponse } from './signup'
import { SyncRequest, SyncResponse } from './sync'

export class PlayerEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  signup(body: SignupRequest): Promise<SignupResponse> {
    return this.fetcher.post('/player/signup', body)
  }

  refresh(body: RefreshRequest): Promise<RefreshResponse> {
    return this.fetcher.put('/player/refresh', body)
  }

  sync(body: SyncRequest): Promise<SyncResponse> {
    return this.fetcher.post('/player/sync', body)
  }
}
