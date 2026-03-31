import { getCity, listCities, refreshCity } from './thunk'

const mockGet = jest.fn()
const mockList = jest.fn()

jest.mock('#helpers/api', () => ({
  client: {
    city: {
      get: (...args: unknown[]) => mockGet(...args),
      list: (...args: unknown[]) => mockList(...args),
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

const makeListGetState = (token = 'my-token') => () => ({
  auth: { token },
})

describe('listCities', () => {
  beforeEach(() => {
    mockList.mockReset()
  })

  it('returns cities and count_limit on success', async () => {
    const cities = [{ id: 'c1', name: 'Alpha' }]
    mockList.mockResolvedValue({ status: 'ok', data: { cities, count_limit: 5 } })
    const dispatch = jest.fn()

    const result = await listCities()(dispatch, makeListGetState() as never, undefined)

    expect(result.payload).toEqual({ cities, count_limit: 5 })
  })

  it('rejects with error_code when the response is an error', async () => {
    mockList.mockResolvedValue({ status: 'nok', error_code: 'city:list_failed' })
    const dispatch = jest.fn()

    const result = await listCities()(dispatch, makeListGetState() as never, undefined)

    expect(result.payload).toBe('city:list_failed')
  })
})

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
