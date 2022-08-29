import { BuildingModule } from './building/module'
import { CityModule } from './city/module'
import { Repository } from './shared/repository'

export class App {
  city: CityModule
  building: BuildingModule

  constructor(repository: Repository) {
    this.city = new CityModule(repository)
    this.building = new BuildingModule(repository)
  }
}
