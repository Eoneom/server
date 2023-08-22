import { mongoose } from '@typegoose/typegoose'
import { Factory } from '#adapter/factory'

import { AuthRepository } from '#app/port/repository/auth'
import { MongoAuthRepository } from '#adapter/repository/auth'
import { BuildingRepository } from '#app/port/repository/building'
import { MongoBuildingRepository } from '#adapter/repository/building'
import { CityRepository } from '#app/port/repository/city'
import { MongoCityRepository } from '#adapter/repository/city'
import { PlayerRepository } from '#app/port/repository/player'
import { MongoPlayerRepository } from '#adapter/repository/player'
import { TechnologyRepository } from '#app/port/repository/technology'
import { MongoTechnologyRepository } from '#adapter/repository/technology'
import { Repository } from '#app/port/repository/generic'
import { CellRepository } from '#app/port/repository/cell'
import { MongoCellRepository } from '#adapter/repository/cell'

export class MongoRepository implements Repository {
  auth: AuthRepository
  building: BuildingRepository
  cell: CellRepository
  city: CityRepository
  player: PlayerRepository
  technology: TechnologyRepository

  constructor() {
    this.auth = new MongoAuthRepository()
    this.building = new MongoBuildingRepository()
    this.cell = new MongoCellRepository()
    this.city = new MongoCityRepository()
    this.player = new MongoPlayerRepository()
    this.technology = new MongoTechnologyRepository()
  }

  async connect(): Promise<void> {
    const logger = Factory.getLogger('database:repository')
    logger.info('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'swarm' })
    logger.info('connected to database')
  }
}


