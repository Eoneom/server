
import { BuildingEventCode } from '../core/building/domain/events'
import { CityEventCode } from '../core/city/domain/events'
import { EventBus } from '../core/eventbus'
import { TechnologyEventCode } from '../core/technology/domain/events'

export const logEvents = (eventbus: EventBus) => {
  const event_codes = [
    ...Object.values(CityEventCode).filter(value => value !== CityEventCode.RESOURCES_GATHERED),
    ...Object.values(BuildingEventCode),
    ...Object.values(TechnologyEventCode)
  ]

  event_codes.forEach((event_code) => {
    eventbus.listen(
      event_code,
      (payload) => console.log(event_code, payload)
    )
  })
}
