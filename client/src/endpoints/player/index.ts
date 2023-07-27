import { Fetcher } from '../../fetcher'
import {
  LoginRequest, LoginResponse
} from './login'
import {
  SignupRequest, SignupResponse
} from './signup'
import { SyncResponse } from './sync'

export class PlayerEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  login(body: LoginRequest): Promise<LoginResponse> {
    return this.fetcher.post('/player/login', { body })
  }

  signup(body: SignupRequest): Promise<SignupResponse> {
    return this.fetcher.post('/player/signup', { body })
  }

  sync(token: string): Promise<SyncResponse> {
    return this.fetcher.post('/player/sync', { token })
  }
}
