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

export class MongoRepository implements Repository {
  city: CityRepository
  building: BuildingRepository
  player: PlayerRepository
  technology: TechnologyRepository
  level_cost: LevelCostRepository
  unit_cost: UnitCostRepository

  constructor() {
    this.city = new MongoCityRepository(CityModel)
    this.building = new MongoBuildingRepository(BuildingModel)
    this.player = new MongoPlayerRepository(PlayerModel)
    this.technology = new MongoTechnologyRepository(TechnologyModel)
    this.level_cost = new MongoLevelCostRepository(LevelCostModel)
    this.unit_cost = new MongoUnitCostRepository(UnitCostModel)
  }

  async connect(): Promise<void> {
    console.log('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: 'swarm'
    })

    console.log('connected to database')
  }
}


