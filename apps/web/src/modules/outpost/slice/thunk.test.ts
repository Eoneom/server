import { setOutpostPermanent } from './thunk'

const mockSetPermanent = jest.fn()

jest.mock('#helpers/api', () => ({
  client: {
    outpost: {
      setPermanent: (...args: unknown[]) => mockSetPermanent(...args)
    }
  }
}))

describe('setOutpostPermanent', () => {
  beforeEach(() => {
    mockSetPermanent.mockReset()
  })

  it('calls outpost set-permanent endpoint and schedules refreshes', async () => {
    mockSetPermanent.mockResolvedValue({ status: 'ok' })
    const dispatch = jest.fn()
    const getState = () => ({
      auth: { token: 'token' },
      outpost: {
        outpost: { id: 'outpost_id' }
      }
    })

    await setOutpostPermanent()(dispatch, getState as never, undefined)

    expect(mockSetPermanent).toHaveBeenCalledWith('token', { outpost_id: 'outpost_id' })
    const nestedThunks = dispatch.mock.calls
      .map(([ action ]) => action)
      .filter(action => typeof action === 'function')
    expect(nestedThunks).toHaveLength(2)
  })
})
