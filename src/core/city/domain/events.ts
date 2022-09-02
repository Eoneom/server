import { BuildingCode } from '../../building/domain/constants'

export enum CityEventCode {
  SETTLED = 'city:settled',
  RESOURCES_GATHERED = 'city:resources-gathered',
  BUILDING_PURCHASED = 'city:building-purchased'
}

export interface CityPayloads {
  [CityEventCode.SETTLED]: {
    city_id: string
  },
  [CityEventCode.RESOURCES_GATHERED]: {
    city_id: string
  },
  [CityEventCode.BUILDING_PURCHASED]: {
    city_id: string
    building_code: BuildingCode
    duration: number
  }
}
