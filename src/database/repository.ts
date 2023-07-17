import { LevelCostRepository, UnitCostRepository } from '../core/pricing/model'

import { BuildingModel } from '../core/building/model/document'
import { BuildingRepository } from '../core/building/model'
import { CityModel } from '../core/city/model/document'
import { CityRepository } from '../core/city/model'
import { LevelCostModel } from '../core/pricing/model/level_cost/document'
import { MongoBuildingRepository } from '../core/building/model/mongo'
import { MongoCityRepository } from '../core/city/model/mongo'
import { MongoLevelCostRepository } from '../core/pricing/model/level_cost/mongo'
import { MongoPlayerRepository } from '../core/player/model/mongo'
import { MongoTechnologyRepository } from '../core/technology/model/mongo'
import { MongoUnitCostRepository } from '../core/pricing/model/unit/mongo'
import { PlayerModel } from '../core/player/model/document'
import { PlayerRepository } from '../core/player/model'
import { Repository } from '../shared/repository'
import { TechnologyModel } from '../core/technology/model/document'
import { TechnologyRepository } from '../core/technology/model'
import { UnitCostModel } from '../core/pricing/model/unit/document'
import mongoose from 'mongoose'
import { CityErrors } from '../core/city/domain/errors'
import { BuildingErrors } from '../core/building/domain/errors'
import { PlayerErrors } from '../core/player/domain/errors'
import { TechnologyErrors } from '../core/technology/domain/errors'
import { PricingErrors } from '../core/pricing/domain/errors'

export class MongoRepository implements Repository {
  city: CityRepository
  building: BuildingRepository
  player: PlayerRepository
  technology: TechnologyRepository
  level_cost: LevelCostRepository
  unit_cost: UnitCostRepository

  constructor() {
    this.city = new MongoCityRepository(CityModel, CityErrors.NOT_FOUND)
    this.building = new MongoBuildingRepository(BuildingModel, BuildingErrors.NOT_FOUND)
    this.player = new MongoPlayerRepository(PlayerModel, PlayerErrors.NOT_FOUND)
    this.technology = new MongoTechnologyRepository(TechnologyModel, TechnologyErrors.NOT_FOUND)
    this.level_cost = new MongoLevelCostRepository(LevelCostModel, PricingErrors.LEVEL_COST_NOT_FOUND)
    this.unit_cost = new MongoUnitCostRepository(UnitCostModel, PricingErrors.LEVEL_COST_NOT_FOUND)
  }

  async connect(): Promise<void> {
    console.log('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: 'swarm'
    })

    console.log('connected to database')
  }
}


