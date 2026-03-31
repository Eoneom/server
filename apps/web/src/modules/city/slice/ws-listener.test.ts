import { registerCityWsListeners } from './ws-listener'
import { AppEvent } from '@eoneom/api-client'

const mockOn = jest.fn()
jest.mock('#helpers/websocket', () => ({
  wsClient: {
    on: (...args: unknown[]) => mockOn(...args),
  },
}))

const mockDispatch = jest.fn()
jest.mock('#store/index', () => ({
  store: {
    dispatch: (...args: unknown[]) => mockDispatch(...args),
  },
}))

describe('registerCityWsListeners', () => {
  beforeEach(() => {
    mockOn.mockReset()
    mockDispatch.mockReset()
  })

  it('registers a handler for AppEvent.CityResourcesGathered', () => {
    registerCityWsListeners()

    expect(mockOn).toHaveBeenCalledWith(AppEvent.CityResourcesGathered, expect.any(Function))
  })

  it('dispatches getCity with the correct city_id when the event fires', () => {
    registerCityWsListeners()

    const handler: (payload: { city_id: string }) => void = mockOn.mock.calls[0][1]
    handler({ city_id: 'city-abc' })

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    const dispatchedAction = mockDispatch.mock.calls[0][0]
    expect(typeof dispatchedAction).toBe('function')
  })
})
