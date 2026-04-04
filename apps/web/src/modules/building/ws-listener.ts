import { AppEvent } from '@eoneom/api-client'
import { wsClient } from '#helpers/websocket'
import { queryClient } from '#helpers/query-client'

export function registerBuildingWsListeners(): void {
  wsClient.on<{ city_id: string }>(AppEvent.BuildingUpgradeFinished, ({ city_id }) => {
    queryClient.invalidateQueries({ queryKey: ['buildings', city_id] })
    queryClient.invalidateQueries({ queryKey: ['city', city_id] })
  })
}
