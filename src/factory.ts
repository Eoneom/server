import { BuildingApp } from './core/building/app'
import { CityApp } from './core/city/app'
import { MongoRepository } from './database'
import { Repository } from './core/shared/repository'

export class Factory {
  private static repository?: Repository
  private static building_app?: BuildingApp
  private static city_app?: CityApp

  static getCityApp(): CityApp {
    if (!this.city_app) {
      const repository = this.getRepository()
      this.city_app = new CityApp(repository.city)
    }

    return this.city_app
  }

  static getBuildingApp(): BuildingApp {
    if (!this.building_app) {
      const repository = this.getRepository()
      this.building_app = new BuildingApp(repository.building)
    }

    return this.building_app
  }

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }
}
