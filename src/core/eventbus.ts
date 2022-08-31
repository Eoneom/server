import { CityEventCode, CityPayloads } from './city/domain/events'

export type EventCode = CityEventCode
export type Payloads = CityPayloads

export interface Registry {
  unregister: () => void
}

export interface Callable {
  [key: string]: Function
}

export interface Subscriber {
  [key: string]: Callable
}

export interface EventBus {
  dispatch<Code extends EventCode>(event: Code, arg?: Payloads[Code]): Promise<void>
  register<Code extends EventCode>(
    event: Code,
    callback: (payload: Payloads[Code]) => void
  ): Registry
}
