import { AppEvent } from '@eoneom/api-client'
import { wsClient } from '#helpers/websocket'
import { queryClient } from '#helpers/query-client'
import { cityKeys } from '#city/hooks'

export function registerCityWsListeners(): void {
  wsClient.on<{ city_id: string }>(AppEvent.CityResourcesGathered, ({ city_id }) => {
    queryClient.invalidateQueries({ queryKey: cityKeys.detail(city_id) })
  })
}
