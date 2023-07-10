export enum BuildingEventCode {
  UPGRADED = 'building:upgraded',
}

export interface BuildingPayloads {
  [BuildingEventCode.UPGRADED]: {
    code: string
  },
}
