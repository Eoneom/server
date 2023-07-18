import { TechnologyCode } from '#core/technology/domain/constants'

export enum CityEventCode {
  TECHNOLOGY_PURCHASED = 'city:technology-purchased'
}

export interface CityPayloads {
  [CityEventCode.TECHNOLOGY_PURCHASED]: {
    city_id: string
    technology_code: TechnologyCode
    duration: number
  }
}
