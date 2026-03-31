jest.mock('ws', () => ({
  WebSocketServer: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  })),
  WebSocket: { OPEN: 1 },
}))

jest.mock('#app/command/auth/authorize', () => ({
  authorizeAuth: jest.fn(),
}))

import { setupWebSocketServer } from './ws'
import { WebSocketServer, WebSocket } from 'ws'
import { Factory } from '#adapter/factory'
import { AppEvent } from '#core/events'
import { authorizeAuth } from '#app/command/auth/authorize'
import { Server } from 'http'

function makeMockWs(readyState: number = WebSocket.OPEN) {
  const handlers: Map<string, () => void> = new Map()
  return {
    close: jest.fn(),
    send: jest.fn(),
    on: jest.fn((event: string, handler: () => void) => {
      handlers.set(event, handler)
    }),
    readyState,
    _handlers: handlers,
  }
}

function makeReq(url: string) {
  return { url }
}

describe('setupWebSocketServer', () => {
  let mockLogger: { info: jest.Mock; error: jest.Mock; warn: jest.Mock; debug: jest.Mock; child: jest.Mock }
  let capturedEventListeners: Map<string, (payload: unknown) => void>
  let connectionHandler: (ws: ReturnType<typeof makeMockWs>, req: ReturnType<typeof makeReq>) => Promise<void>
  let wssInstance: { on: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    capturedEventListeners = new Map()

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      child: jest.fn(),
    }

    jest.spyOn(Factory, 'getEventBus').mockReturnValue({
      emit: jest.fn(),
      on: jest.fn((event: string, handler: (payload: unknown) => void) => {
        capturedEventListeners.set(event, handler)
      }),
    } as any)

    jest.spyOn(Factory, 'getLogger').mockReturnValue(mockLogger as any)

    setupWebSocketServer({} as Server)

    wssInstance = (WebSocketServer as unknown as jest.Mock).mock.results[
      (WebSocketServer as unknown as jest.Mock).mock.results.length - 1
    ].value

    const connectionCall = (wssInstance.on as jest.Mock).mock.calls.find(
      ([event]) => event === 'connection'
    )
    connectionHandler = connectionCall[1]
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('closes the connection when token is missing from the URL', async () => {
    const mockWs = makeMockWs()

    await connectionHandler(mockWs, makeReq('/'))

    expect(mockWs.close).toHaveBeenCalledWith(4001, 'token:not_found')
  })

  it('closes the connection when authorization fails', async () => {
    ;(authorizeAuth as jest.Mock).mockRejectedValue(new Error('invalid token'))
    const mockWs = makeMockWs()

    await connectionHandler(mockWs, makeReq('/?token=bad-token'))

    expect(mockWs.close).toHaveBeenCalledWith(4001, 'unauthorized')
  })

  it('forwards CityResourcesGathered event to the connected player WebSocket', async () => {
    const player_id = 'player-1'
    const city_id = 'city-1'
    ;(authorizeAuth as jest.Mock).mockResolvedValue({ player_id })
    const mockWs = makeMockWs(WebSocket.OPEN)

    await connectionHandler(mockWs, makeReq('/?token=valid-token'))

    const eventHandler = capturedEventListeners.get(AppEvent.CityResourcesGathered)
    eventHandler?.({ city_id, player_id })

    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({ type: AppEvent.CityResourcesGathered, city_id })
    )
  })

  it('does not send when the WebSocket is not open', async () => {
    const player_id = 'player-2'
    ;(authorizeAuth as jest.Mock).mockResolvedValue({ player_id })
    const mockWs = makeMockWs(0)

    await connectionHandler(mockWs, makeReq('/?token=valid-token'))

    const eventHandler = capturedEventListeners.get(AppEvent.CityResourcesGathered)
    eventHandler?.({ city_id: 'city-1', player_id })

    expect(mockWs.send).not.toHaveBeenCalled()
  })

  it('removes the player connection on WebSocket close and stops forwarding events', async () => {
    const player_id = 'player-3'
    ;(authorizeAuth as jest.Mock).mockResolvedValue({ player_id })
    const mockWs = makeMockWs(WebSocket.OPEN)

    await connectionHandler(mockWs, makeReq('/?token=valid-token'))

    mockWs._handlers.get('close')?.()

    const eventHandler = capturedEventListeners.get(AppEvent.CityResourcesGathered)
    eventHandler?.({ city_id: 'city-1', player_id })

    expect(mockWs.send).not.toHaveBeenCalled()
  })
})
