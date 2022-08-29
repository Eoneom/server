import { BuildingRepository } from '../ports/repository/building'
import { CityRepository } from '../ports/repository/city'

export interface Repository {
  connect(): Promise<void>
  city: CityRepository
  building: BuildingRepository
}
