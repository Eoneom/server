import { BuildingModule } from '#core/building/module'
import { CityModule } from '#core/city/module'
import { EventBus } from '#core/eventbus'
import { Modules } from '#core/modules'
import { PlayerModule } from '#core/player/module'
import { PricingModule } from '#core/pricing/module'
import { TechnologyModule } from '#core/technology/module'
import { MongoRepository } from '#database/repository'
import { SimpleEventBus } from '#eventbus/index'
import { Repository } from '#shared/repository'

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
