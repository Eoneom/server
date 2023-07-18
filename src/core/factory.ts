import { AuthModule } from '#core/auth/module'
import { BuildingModule } from '#core/building/module'
import { CityModule } from '#core/city/module'
import { Modules } from '#core/modules'
import { PlayerModule } from '#core/player/module'
import { PricingModule } from '#core/pricing/module'
import { TechnologyModule } from '#core/technology/module'
import { MongoRepository } from '#database/repository'
import { Repository } from '#shared/repository'

export class Factory {
  private static repository: Repository

  static getModules(): Modules {
    return {
      auth: AuthModule.getInstance(),
      building: BuildingModule.getInstance(),
      city: CityModule.getInstance(),
      player: PlayerModule.getInstance(),
      pricing: PricingModule.getInstance(),
      technology: TechnologyModule.getInstance(),
    }
  }

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }
}
