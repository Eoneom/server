import { AppEvent } from '@eoneom/api-client'
import { wsClient } from '#helpers/websocket'
import { store } from '#store/index'
import { listBuildings } from './thunk'
import { refreshCity } from '#city/slice/thunk'

export function registerBuildingWsListeners(): void {
  wsClient.on<{ city_id: string }>(AppEvent.BuildingUpgradeFinished, () => {
    store.dispatch(listBuildings())
    store.dispatch(refreshCity())
  })
}
