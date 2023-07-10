import { BuildingCommands } from './building/commands'
import { BuildingModule } from './building/module'
import { BuildingQueries } from './building/queries'
import { BuildingService } from './building/domain/service'
import { CityCommands } from './city/commands'
import { CityModule } from './city/module'
import { CityQueries } from './city/queries'
import { EventBus } from './eventbus'
import { Module } from '../shared/module'
import { MongoRepository } from '../database/repository'
import { PlayerCommands } from './player/commands'
import { PlayerModule } from './player/module'
import { PlayerQueries } from './player/queries'
import { PricingCommands } from './pricing/commands'
import { PricingModule } from './pricing/module'
import { PricingQueries } from './pricing/queries'
import { Repository } from '../shared/repository'
import { SimpleEventBus } from '../eventbus'
import { TechnologyCommands } from './technology/commands'
import { TechnologyModule } from './technology/module'
import { TechnologyQueries } from './technology/queries'
import { TechnologyService } from './technology/domain/service'
import { Modules } from './modules'

export class Factory {
  private static repository: Repository
  private static eventbus: EventBus

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

  private static pricing_module: PricingModule
  private static pricing_queries: PricingQueries
  private static pricing_commands: PricingCommands

  static getModules(): Modules {
    return {
      city: this.getCityModule(),
      building: this.getBuildingModule(),
      player: this.getPlayerModule(),
      technology: this.getTechnologyModule(),
      pricing: this.getPricingModule(),
    }
  }

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }

  static getEventBus(): EventBus {
    if (!this.eventbus) {
      this.eventbus = new SimpleEventBus()
    }

    return this.eventbus
  }

  private static getBuildingModule(): BuildingModule {
    if (!this.building_module) {
      this.building_module = new BuildingModule({
        queries: this.getBuildingQueries(),
        commands: this.getBuildingCommands()
      })
    }

    return this.building_module
  }

  private static getCityModule(): CityModule {
    if (!this.city_module) {
      this.city_module = new CityModule({
        queries: this.getCityQueries(),
        commands: this.getCityCommands()
      })
    }

    return this.city_module
  }

  private static getPlayerModule(): PlayerModule {
    if (!this.player_module) {
      this.player_module = new Module({
        queries: this.getPlayerQueries(),
        commands: this.getPlayerCommands()
      })
    }

    return this.player_module
  }

  private static getTechnologyModule(): TechnologyModule {
    if (!this.technology_module) {
      this.technology_module = new TechnologyModule({
        queries: this.getTechnologyQueries(),
        commands: this.getTechnologyCommands()
      })
    }

    return this.technology_module
  }

  private static getPricingModule(): PricingModule {
    if (!this.pricing_module) {
      this.pricing_module = new Module({
        queries: this.getPricingQueries(),
        commands: this.getPricingCommands(),
      })
    }

    return this.pricing_module
  }

  private static getBuildingQueries(): BuildingQueries {
    if (!this.building_queries) {
      this.building_queries = new BuildingQueries({
        repository: this.getRepository().building,
        service: new BuildingService(),
      })
    }

    return this.building_queries
  }

  private static getBuildingCommands(): BuildingCommands {
    if (!this.building_commands) {
      this.building_commands = new BuildingCommands({
        repository: this.getRepository().building,
        service: new BuildingService(),
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
        pricing_queries: this.getPricingQueries()
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
      })
    }

    return this.player_commands
  }

  private static getTechnologyQueries(): TechnologyQueries {
    if (!this.technology_queries) {
      this.technology_queries = new TechnologyQueries({
        repository: this.getRepository().technology,
      })
    }

    return this.technology_queries
  }

  private static getTechnologyCommands(): TechnologyCommands {
    if (!this.technology_commands) {
      this.technology_commands = new TechnologyCommands({
        repository: this.getRepository().technology,
        service: new TechnologyService(),
        building_queries: this.getBuildingQueries(),
      })
    }

    return this.technology_commands
  }

  private static getPricingQueries(): PricingQueries {
    if (!this.pricing_queries) {
      this.pricing_queries = new PricingQueries({
        level_repository: this.getRepository().level_cost,
        unit_repository: this.getRepository().unit_cost,
      })
    }

    return this.pricing_queries
  }

  private static getPricingCommands(): PricingCommands {
    if (!this.pricing_commands) {
      this.pricing_commands = new PricingCommands({
        level_repository: this.getRepository().level_cost,
        unit_repository: this.getRepository().unit_cost,
      })
    }

    return this.pricing_commands
  }
}
