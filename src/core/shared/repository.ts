import { BuildingRepository } from '../building/repository'
import { CityRepository } from '../city/repository'

export interface Repository {
  city: CityRepository
  building: BuildingRepository
}
