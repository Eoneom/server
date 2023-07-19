import { AuthErrors } from '#core/auth/domain/errors'
import { AuthRepository } from '#core/auth/model'
import { AuthModel } from '#core/auth/model/document'
import { MongoAuthRepository } from '#core/auth/model/mongo'
import { BuildingErrors } from '#core/building/domain/errors'
import { BuildingRepository } from '#core/building/model'
import { BuildingModel } from '#core/building/model/document'
import { MongoBuildingRepository } from '#core/building/model/mongo'
import { CityErrors } from '#core/city/domain/errors'
import { CityRepository } from '#core/city/model'
import { CityModel } from '#core/city/model/document'
import { MongoCityRepository } from '#core/city/model/mongo'
import { PlayerErrors } from '#core/player/domain/errors'
import { PlayerRepository } from '#core/player/model'
import { PlayerModel } from '#core/player/model/document'
import { MongoPlayerRepository } from '#core/player/model/mongo'
import { PricingErrors } from '#core/pricing/domain/errors'
import {
  LevelCostRepository, UnitCostRepository 
} from '#core/pricing/model'
import { LevelCostModel } from '#core/pricing/model/level_cost/document'
import { MongoLevelCostRepository } from '#core/pricing/model/level_cost/mongo'
import { UnitCostModel } from '#core/pricing/model/unit_cost/document'
import { MongoUnitCostRepository } from '#core/pricing/model/unit_cost/mongo'
import { TechnologyErrors } from '#core/technology/domain/errors'
import { TechnologyRepository } from '#core/technology/model'
import { TechnologyModel } from '#core/technology/model/document'
import { MongoTechnologyRepository } from '#core/technology/model/mongo'
import { Repository } from '#shared/repository'
import { mongoose } from '@typegoose/typegoose'


export class MongoRepository implements Repository {
  auth: AuthRepository
  building: BuildingRepository
  city: CityRepository
  level_cost: LevelCostRepository
  player: PlayerRepository
  technology: TechnologyRepository
  unit_cost: UnitCostRepository

  constructor() {
    this.auth = new MongoAuthRepository(AuthModel, AuthErrors.NOT_FOUND)
    this.building = new MongoBuildingRepository(BuildingModel, BuildingErrors.NOT_FOUND)
    this.city = new MongoCityRepository(CityModel, CityErrors.NOT_FOUND)
    this.level_cost = new MongoLevelCostRepository(LevelCostModel, PricingErrors.LEVEL_COST_NOT_FOUND)
    this.player = new MongoPlayerRepository(PlayerModel, PlayerErrors.NOT_FOUND)
    this.technology = new MongoTechnologyRepository(TechnologyModel, TechnologyErrors.NOT_FOUND)
    this.unit_cost = new MongoUnitCostRepository(UnitCostModel, PricingErrors.LEVEL_COST_NOT_FOUND)
  }

  async connect(): Promise<void> {
    console.log('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'swarm' })

    console.log('connected to database')
  }
}


