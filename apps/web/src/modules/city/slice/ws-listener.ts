import { AppEvent } from '@eoneom/api-client'
import { wsClient } from '#helpers/websocket'
import { store } from '#store/index'
import { getCity } from './thunk'

export function registerCityWsListeners(): void {
  wsClient.on<{ city_id: string }>(AppEvent.CityResourcesGathered, ({ city_id }) => {
    store.dispatch(getCity(city_id))
  })
}
