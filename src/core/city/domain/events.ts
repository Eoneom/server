export enum CityEventCode {
  CREATED_CITY = 'CREATED_CITY',
  CREATE_CITY = 'CREATE_CITY'
}

export interface CityPayloads {
  [CityEventCode.CREATED_CITY]: {
    id: string
  },
  [CityEventCode.CREATE_CITY]: {
    name: string
  }
}
