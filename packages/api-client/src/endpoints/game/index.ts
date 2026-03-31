import { Fetcher } from '../../fetcher'
import {
  GameRefreshStateRequest,
  GameRefreshStateResponse
} from './refresh-state'

export class GameEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  refreshState(token: string, body: GameRefreshStateRequest): Promise<GameRefreshStateResponse> {
    return this.fetcher.put('/game/refresh-state', {
      token,
      body
    })
  }
}
