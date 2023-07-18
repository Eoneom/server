import { CityEventCode } from '#core/city/domain/events'
import { EventBus } from '#core/eventbus'

export const logEvents = (eventbus: EventBus) => {
  const event_codes = [
    ...Object.values(CityEventCode),
  ]

  event_codes.forEach((event_code) => {
    eventbus.listen(
      event_code,
      (payload) => console.log(event_code, payload)
    )
  })
}
