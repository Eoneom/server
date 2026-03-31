import { AppEvent } from '@eoneom/api-client'
import { wsClient } from '#helpers/websocket'
import { store } from '#store/index'
import { listTechnologies } from './thunk'

export function registerTechnologyWsListeners(): void {
  wsClient.on(AppEvent.TechnologyResearchFinished, () => {
    store.dispatch(listTechnologies())
  })
}
