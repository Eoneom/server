import { registerTroopWsListeners } from './ws-listener'
import { AppEvent } from '@eoneom/api-client'

const mockOn = jest.fn()
jest.mock('#helpers/websocket', () => ({
  wsClient: {
    on: (...args: unknown[]) => mockOn(...args),
  },
}))

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
jest.mock('#store/index', () => ({
  store: {
    dispatch: (...args: unknown[]) => mockDispatch(...args),
    getState: () => mockGetState(),
  },
}))

jest.mock('#outpost/slice', () => ({
  resetOutpost: jest.fn(() => ({ type: 'outpost/resetOutpost' })),
  selectOutpostId: jest.fn((state: unknown) => state),
}))

import { resetOutpost, selectOutpostId } from '#outpost/slice'

describe('registerTroopWsListeners', () => {
  beforeEach(() => {
    mockOn.mockReset()
    mockDispatch.mockReset()
    mockGetState.mockReset()
  })

  it('registers a handler for AppEvent.TroopMovementFinished', () => {
    registerTroopWsListeners()

    expect(mockOn).toHaveBeenCalledWith(AppEvent.TroopMovementFinished, expect.any(Function))
  })

  it('registers a handler for AppEvent.OutpostCreated', () => {
    registerTroopWsListeners()

    expect(mockOn).toHaveBeenCalledWith(AppEvent.OutpostCreated, expect.any(Function))
  })

  it('registers a handler for AppEvent.OutpostDeleted', () => {
    registerTroopWsListeners()

    expect(mockOn).toHaveBeenCalledWith(AppEvent.OutpostDeleted, expect.any(Function))
  })

  it('dispatches listOutposts when OutpostDeleted fires', () => {
    mockGetState.mockReturnValue('other-outpost-id')
    registerTroopWsListeners()

    const handler: (payload: { outpost_id: string }) => void = mockOn.mock.calls.find(
      ([event]: [string]) => event === AppEvent.OutpostDeleted
    )[1]

    handler({ outpost_id: 'deleted-outpost-id' })

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    const dispatchedAction = mockDispatch.mock.calls[0][0]
    expect(typeof dispatchedAction).toBe('function')
  })

  it('also dispatches resetOutpost when OutpostDeleted fires for the currently selected outpost', () => {
    const outpost_id = 'current-outpost-id'
    mockGetState.mockReturnValue(outpost_id)
    ;(selectOutpostId as jest.Mock).mockReturnValue(outpost_id)

    registerTroopWsListeners()

    const handler: (payload: { outpost_id: string }) => void = mockOn.mock.calls.find(
      ([event]: [string]) => event === AppEvent.OutpostDeleted
    )[1]

    handler({ outpost_id })

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(resetOutpost).toHaveBeenCalled()
  })

  it('does not dispatch resetOutpost when OutpostDeleted fires for a different outpost', () => {
    mockGetState.mockReturnValue('other-outpost-id')
    ;(selectOutpostId as jest.Mock).mockReturnValue('other-outpost-id')

    registerTroopWsListeners()

    const handler: (payload: { outpost_id: string }) => void = mockOn.mock.calls.find(
      ([event]: [string]) => event === AppEvent.OutpostDeleted
    )[1]

    handler({ outpost_id: 'deleted-outpost-id' })

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(resetOutpost).not.toHaveBeenCalled()
  })
})
