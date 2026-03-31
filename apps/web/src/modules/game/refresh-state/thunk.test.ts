import { refreshGameState } from './thunk'

const mockRefreshState = jest.fn()

jest.mock('#helpers/api', () => ({
  client: {
    game: {
      refreshState: (...args: unknown[]) => mockRefreshState(...args),
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

describe('refreshGameState', () => {
  beforeEach(() => {
    mockRefreshState.mockReset()
  })

  it('calls client.game.refreshState with the token and cityId from state', async () => {
    mockRefreshState.mockResolvedValue({ status: 'ok' })
    const dispatch = jest.fn()

    await refreshGameState()(dispatch, makeGetState() as never, undefined)

    expect(mockRefreshState).toHaveBeenCalledWith('my-token', { city_id: 'city-id' })
  })

  it('does not call the API when cityId is null', async () => {
    const dispatch = jest.fn()

    await refreshGameState()(dispatch, makeGetState({ cityId: null }) as never, undefined)

    expect(mockRefreshState).not.toHaveBeenCalled()
  })
})
