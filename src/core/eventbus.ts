import { CityEventCode, CityPayloads } from '#core/city/domain/events'

export const event_codes = {
  ...CityEventCode
}

export type EventCode = CityEventCode

export type Payloads = CityPayloads

export interface Registry {
  unregister: () => void
}

export interface Callable {
  [key: string]: (payload: any) => void
}

export interface Subscriber {
  [key: string]: Callable
}

export interface EventBus {
  emit<Code extends EventCode>(code: Code, arg: Payloads[Code]): Promise<void>
  listen<Code extends EventCode>(
    code: Code,
    callback: (payload: Payloads[Code]) => void
  ): Registry
}
