import { TechnologyCode } from '../../technology/domain/constants'

export enum CityEventCode {
  SETTLED = 'city:settled',
  RESOURCES_GATHERED = 'city:resources-gathered',
  PURCHASED = 'city:purchased',
  TECHNOLOGY_PURCHASED = 'city:technology-purchased',
  PURCHASE_REQUESTED = 'city:purchase-requested',
}

export interface CityPayloads {
  [CityEventCode.SETTLED]: {
    city_id: string
  },
  [CityEventCode.RESOURCES_GATHERED]: {
    city_id: string
    plastic: number
    mushroom: number
  },
  [CityEventCode.PURCHASED]: {
    city_id: string
    player_id: string
    code: string
    duration: number
  },
  [CityEventCode.TECHNOLOGY_PURCHASED]: {
    city_id: string
    technology_code: TechnologyCode
    duration: number
  },
  [CityEventCode.PURCHASE_REQUESTED]: {
    city_id: string
    code: string
    current_level: number
  }
}
