import { BuildingCommands } from './building/commands'
import { BuildingModule } from './building/module'
import { BuildingQueries } from './building/queries'
import { BuildingService } from './building/domain/service'
import { CityCommands } from './city/commands'
import { CityModule } from './city/module'
import { CityQueries } from './city/queries'
import { Module } from './shared/module'
import { MongoRepository } from '../database/repository'
import { PlayerCommands } from './player/commands'
import { PlayerModule } from './player/module'
import { PlayerQueries } from './player/queries'
import { Repository } from './shared/repository'
import { TechnologyCommands } from './technology/commands'
import { TechnologyModule } from './technology/module'
import { TechnologyQueries } from './technology/queries'
import { TechnologyService } from './technology/domain/service'

export class Factory {
  private static repository: Repository

  private static building_module: BuildingModule
  private static building_queries: BuildingQueries
  private static building_commands: BuildingCommands

  private static city_module: CityModule
  private static city_queries: CityQueries
  private static city_commands: CityCommands

  private static player_module: PlayerModule
  private static player_queries: PlayerQueries
  private static player_commands: PlayerCommands

  private static technology_module: TechnologyModule
  private static technology_queries: TechnologyQueries
  private static technology_commands: TechnologyCommands

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

  static getPlayerModule(): PlayerModule {
    if (!this.player_module) {
      this.player_module = new Module({
        queries: this.getPlayerQueries(),
        commands: this.getPlayerCommands()
      })
    }

    return this.player_module
  }

  static getTechnologyModule(): TechnologyModule {
    if (!this.technology_module) {
      this.technology_module = new Module({
        queries: this.getTechnologyQueries(),
        commands: this.getTechnologyCommands()
      })
    }

    return this.technology_module
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
        city_commands: this.getCityCommands(),
        city_queries: this.getCityQueries()
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
        building_queries: this.getBuildingQueries(),
      })
    }

    return this.city_commands
  }

  private static getPlayerQueries(): PlayerQueries {
    if (!this.player_queries) {
      this.player_queries = new PlayerQueries({
        repository: this.getRepository().player
      })
    }

    return this.player_queries
  }

  private static getPlayerCommands(): PlayerCommands {
    if (!this.player_commands) {
      this.player_commands = new PlayerCommands({
        repository: this.getRepository().player,
        city_commands: this.getCityCommands(),
        city_queries: this.getCityQueries(),
        building_commands: this.getBuildingCommands(),
        technology_commands: this.getTechnologyCommands()
      })
    }

    return this.player_commands
  }

  private static getTechnologyQueries(): TechnologyQueries {
    if (!this.technology_queries) {
      this.technology_queries = new TechnologyQueries()
    }

    return this.technology_queries
  }

  private static getTechnologyCommands(): TechnologyCommands {
    if (!this.technology_commands) {
      this.technology_commands = new TechnologyCommands({
        repository: this.getRepository().technology,
        service: new TechnologyService(),
        city_queries: this.getCityQueries(),
        city_commands: this.getCityCommands(),
        building_queries: this.getBuildingQueries()
      })
    }

    return this.technology_commands
  }
}
