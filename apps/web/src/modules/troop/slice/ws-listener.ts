import { AppEvent } from '@eoneom/api-client'
import { wsClient } from '#helpers/websocket'
import { store } from '#store/index'
import { listMovements } from './thunk'
import { countUnreadReports } from '#communication/report/slice/thunk'

export function registerTroopWsListeners(): void {
  wsClient.on(AppEvent.TroopMovementFinished, () => {
    store.dispatch(listMovements())
    store.dispatch(countUnreadReports())
  })
}
