import { BuildingEventCode, BuildingPayloads } from './building/domain/events'
import { CityEventCode, CityPayloads } from './city/domain/events'
import { PlayerEventCode, PlayerPayloads } from './player/domain/events'
import { TechnologyEventCode, TechnologyPayloads } from './technology/domain/events'

export type EventCode = CityEventCode |
  BuildingEventCode |
  PlayerEventCode |
  TechnologyEventCode
export type Payloads = CityPayloads &
  BuildingPayloads &
  PlayerPayloads &
  TechnologyPayloads

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
  emit<Code extends EventCode>(event: Code, arg: Payloads[Code]): Promise<void>
  listen<Code extends EventCode>(
    event: Code,
    callback: (payload: Payloads[Code]) => void
  ): Registry
}
