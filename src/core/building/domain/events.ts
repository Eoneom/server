import { EventCode } from '../../eventbus'

export enum BuildingEventCode {
  INITIALIZED = 'building:initialized',
  UPGRADE_LAUNCHED = 'building:upgrade-launched',
  UPGRADED = 'building:upgraded'
}

interface EventbusEvent<Payload> {
  code: EventCode
  payload: Payload
}

export interface BuildingUpgradeEvent extends EventbusEvent<{ code: string }> {
  code: BuildingEventCode.UPGRADED
}

export interface BuildingPayloads {
  [BuildingEventCode.INITIALIZED]: {
    city_id: string
  },
  [BuildingEventCode.UPGRADE_LAUNCHED]: {
    code: string
  },
  [BuildingEventCode.UPGRADED]: {
    code: string
  }
}
