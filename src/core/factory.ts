import { BuildingModule } from './building/module'
import { CityModule } from './city/module'
import { EventBus } from './eventbus'
import { MongoRepository } from '../database/repository'
import { PlayerModule } from './player/module'
import { PricingModule } from './pricing/module'
import { Repository } from '../shared/repository'
import { SimpleEventBus } from '../eventbus'
import { TechnologyModule } from './technology/module'
import { Modules } from './modules'

export class Factory {
  private static repository: Repository
  private static eventbus: EventBus

  static getModules(): Modules {
    return {
      city: CityModule.getInstance(),
      building: BuildingModule.getInstance(),
      player: PlayerModule.getInstance(),
      technology: TechnologyModule.getInstance(),
      pricing: PricingModule.getInstance(),
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
}
