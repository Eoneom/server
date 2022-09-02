export enum CityEventCode {
  CREATED = 'city:created',
  RESOURCES_GATHERED = 'city:resources-gathered'
}

export interface CityPayloads {
  [CityEventCode.CREATED]: {
    city_id: string
  },
  [CityEventCode.RESOURCES_GATHERED]: {
    city_id: string
  }
}
