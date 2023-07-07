import { BuildingEventCode, BuildingPayloads } from './building/domain/events'
import { CityEventCode, CityPayloads } from './city/domain/events'
import { TechnologyEventCode, TechnologyPayloads } from './technology/domain/events'

export const event_codes = {
  ...CityEventCode,
  ...BuildingEventCode,
  ...TechnologyEventCode
}

export type EventCode = CityEventCode |
  BuildingEventCode |
  TechnologyEventCode

export type Payloads = CityPayloads &
  BuildingPayloads &
  TechnologyPayloads

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
