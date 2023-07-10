import { TechnologyCode } from '../../technology/domain/constants'

export enum CityEventCode {
  RESOURCES_GATHERED = 'city:resources-gathered',
  TECHNOLOGY_PURCHASED = 'city:technology-purchased'
}

export interface CityPayloads {
  [CityEventCode.RESOURCES_GATHERED]: {
    city_id: string
    plastic: number
    mushroom: number
  },
  [CityEventCode.TECHNOLOGY_PURCHASED]: {
    city_id: string
    technology_code: TechnologyCode
    duration: number
  }
}
