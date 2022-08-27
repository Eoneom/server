import { BuildingRepository } from '../building/repository'
import { CityRepository } from '../city/repository'

export interface Repository {
  connect(): Promise<void>
  city: CityRepository
  building: BuildingRepository
}
