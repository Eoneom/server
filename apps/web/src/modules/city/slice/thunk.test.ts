import { getCity, refreshCity } from './thunk'

const mockGet = jest.fn()

jest.mock('#helpers/api', () => ({
  client: {
    city: {
      get: (...args: unknown[]) => mockGet(...args),
    },
  },
}))

const makeGetState = (overrides: { cityId?: string | null; token?: string | null } = {}) => {
  const { cityId = 'city-id', token = 'my-token' } = overrides
  return () => ({
    auth: { token },
    city: { city: cityId ? { id: cityId } : null },
  })
}

describe('getCity', () => {
  beforeEach(() => {
    mockGet.mockReset()
  })

  it('calls client.city.get and returns the city data on success', async () => {
    const cityData = { id: 'city-id', name: 'Test City' }
    mockGet.mockResolvedValue({ status: 'ok', data: cityData })
    const dispatch = jest.fn()

    const result = await getCity('city-id')(dispatch, makeGetState() as never, undefined)

    expect(mockGet).toHaveBeenCalledWith('my-token', { city_id: 'city-id' })
    expect(result.payload).toEqual(cityData)
  })

  it('rejects with error_code when the response is an error', async () => {
    mockGet.mockResolvedValue({ status: 'nok', error_code: 'city:not_found' })
    const dispatch = jest.fn()

    const result = await getCity('city-id')(dispatch, makeGetState() as never, undefined)

    expect(result.payload).toBe('city:not_found')
  })
})

describe('refreshCity', () => {
  it('dispatches getCity with the current cityId', async () => {
    const dispatch = jest.fn()

    await refreshCity()(dispatch, makeGetState() as never, undefined)

    const nestedThunks = dispatch.mock.calls
      .map(([action]) => action)
      .filter((action) => typeof action === 'function')
    expect(nestedThunks).toHaveLength(1)
  })
})
