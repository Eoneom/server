import { BuildingCommands } from './building/commands'
import { BuildingModule } from './building/module'
import { BuildingQueries } from './building/queries'
import { BuildingService } from './building/domain/service'
import { CityCommands } from './city/commands'
import { CityModule } from './city/module'
import { CityQueries } from './city/queries'
import { Module } from './shared/module'
import { MongoRepository } from '../database/repository'
import { Repository } from './shared/repository'

export class Factory {
  private static repository: Repository

  private static building_module: BuildingModule
  private static building_queries: BuildingQueries
  private static building_commands: BuildingCommands

  private static city_module: CityModule
  private static city_queries: CityQueries
  private static city_commands: CityCommands

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }

  static getBuildingModule(): BuildingModule {
    if (!this.building_module) {
      this.building_module = new Module({
        queries: this.getBuildingQueries(),
        commands: this.getBuildingCommands()
      })
    }

    return this.building_module
  }

  static getCityModule(): CityModule {
    if (!this.city_module) {
      this.city_module = new Module({
        queries: this.getCityQueries(),
        commands: this.getCityCommands()
      })
    }

    return this.city_module
  }

  private static getBuildingQueries(): BuildingQueries {
    if (!this.building_queries) {
      this.building_queries = new BuildingQueries({
        repository: this.getRepository().building,
        service: new BuildingService()
      })
    }

    return this.building_queries
  }

  private static getBuildingCommands(): BuildingCommands {
    if (!this.building_commands) {
      this.building_commands = new BuildingCommands({
        repository: this.getRepository().building,
        service: new BuildingService(),
        city_commands: this.getCityCommands()
      })
    }

    return this.building_commands
  }

  private static getCityQueries(): CityQueries {
    if (!this.city_queries) {
      this.city_queries = new CityQueries(this.getRepository().city)
    }

    return this.city_queries
  }

  private static getCityCommands(): CityCommands {
    if (!this.city_commands) {
      this.city_commands = new CityCommands({
        repository: this.getRepository().city,
        building_queries: this.getBuildingQueries()
      })
    }

    return this.city_commands
  }
}
