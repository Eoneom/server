import { BuildingModel } from './models/building/document'
import { BuildingRepository } from '../core/building/repository'
import { CityModel } from './models/city/document'
import { CityRepository } from '../core/city/repository'
import { MongoBuildingRepository } from './models/building/repository'
import { MongoCityRepository } from './models/city/repository'
import { MongoPlayerRepository } from './models/player/repository'
import { PlayerModel } from './models/player/document'
import { PlayerRepository } from '../core/player/repository'
import { Repository } from '../core/shared/repository'
import mongoose from 'mongoose'

export class MongoRepository implements Repository {
  city: CityRepository
  building: BuildingRepository
  player: PlayerRepository

  constructor() {
    this.city = new MongoCityRepository(CityModel)
    this.building = new MongoBuildingRepository(BuildingModel)
    this.player = new MongoPlayerRepository(PlayerModel)
  }

  async connect(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: 'swarm'
    })

    console.log('connected to database')
  }
}


