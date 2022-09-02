import { BuildingCode } from './constants'

export enum BuildingEventCode {
  FIRST_INITIALIZED = 'building:first-initialized',
  REQUEST_UPGRADE_TRIGGERED = 'building:request-upgrade-triggered',
  UPGRADE_REQUESTED = 'building:upgrade-requested',
  UPGRADE_LAUNCHED = 'building:upgrade-launched',
  UPGRADED = 'building:upgraded',
}

export interface BuildingPayloads {
  [BuildingEventCode.FIRST_INITIALIZED]: {
    city_id: string
  },
  [BuildingEventCode.REQUEST_UPGRADE_TRIGGERED]: {
    city_id: string
    code: BuildingCode
  }
  [BuildingEventCode.UPGRADE_REQUESTED]: {
    city_id: string
    code: BuildingCode
    current_level: number
  }
  [BuildingEventCode.UPGRADE_LAUNCHED]: {
    code: string
  },
  [BuildingEventCode.UPGRADED]: {
    code: string
  },
}
