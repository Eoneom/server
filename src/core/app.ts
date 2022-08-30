import { BuildingModule } from './building/module'
import { CityModule } from './city/module'
import { Factory } from './factory'
import { PlayerModule } from './player/module'
import { TechnologyModule } from './technology/module'

export class App {
  city: CityModule
  building: BuildingModule
  player: PlayerModule
  technology: TechnologyModule

  constructor() {
    this.city = Factory.getCityModule()
    this.building = Factory.getBuildingModule()
    this.player = Factory.getPlayerModule()
    this.technology = Factory.getTechnologyModule()
  }
}
