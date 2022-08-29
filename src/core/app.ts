import { BuildingCommands } from './building/commands'
import { BuildingQueries } from './building/queries'
import { CityCommands } from './city/commands'
import { CityQueries } from './city/queries'
import { Factory } from './factory'
import { Module } from './shared/module'

export class App {
  city: Module<CityQueries, CityCommands>
  building: Module<BuildingQueries, BuildingCommands>

  constructor() {
    this.city = Factory.getCityModule()
    this.building = Factory.getBuildingModule()
  }
}
