import { AppEventBus } from './event-bus'
import { AppEvent } from '#core/events'
import { AppLogger } from './port/logger'

const makeLogger = (): AppLogger => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(),
} as unknown as AppLogger)

describe('AppEventBus', () => {
  let logger: AppLogger
  let bus: AppEventBus

  beforeEach(() => {
    logger = makeLogger()
    bus = new AppEventBus({ logger })
  })

  it('logs the event and payload when emit is called', () => {
    const payload = { city_id: 'city-1', player_id: 'player-1' }

    bus.emit(AppEvent.CityResourcesGathered, payload)

    expect(logger.info).toHaveBeenCalledWith(AppEvent.CityResourcesGathered, { payload })
  })

  it('delivers the payload to a registered listener', () => {
    const listener = vi.fn()
    const payload = { city_id: 'city-1', player_id: 'player-1' }

    bus.on(AppEvent.CityResourcesGathered, listener)
    bus.emit(AppEvent.CityResourcesGathered, payload)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(payload)
  })

  it('does not call a listener after it has been removed via off', () => {
    const listener = vi.fn()
    const payload = { city_id: 'city-1', player_id: 'player-1' }

    bus.on(AppEvent.CityResourcesGathered, listener)
    bus.off(AppEvent.CityResourcesGathered, listener)
    bus.emit(AppEvent.CityResourcesGathered, payload)

    expect(listener).not.toHaveBeenCalled()
  })
})
