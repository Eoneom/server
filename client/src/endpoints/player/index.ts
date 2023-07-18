import { Fetcher } from '../../fetcher'
import { LoginRequest, LoginResponse } from './login'
import { RefreshRequest, RefreshResponse } from './refresh'
import { SignupRequest, SignupResponse } from './signup'
import { SyncRequest, SyncResponse } from './sync'

export class PlayerEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  login(body: LoginRequest): Promise<LoginResponse> {
    return this.fetcher.post('/player/login', body)
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
