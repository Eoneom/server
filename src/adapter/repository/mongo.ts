import { mongoose } from '@typegoose/typegoose'
import { Factory } from '#adapter/factory'

import { AuthRepository } from '#app/port/repository/auth'
import { MongoAuthRepository } from '#adapter/repository/auth/index'
import { BuildingRepository } from '#app/port/repository/building'
import { MongoBuildingRepository } from '#adapter/repository/building/index'
import { CityRepository } from '#app/port/repository/city'
import { MongoCityRepository } from '#adapter/repository/city/index'
import { PlayerRepository } from '#app/port/repository/player'
import { MongoPlayerRepository } from '#adapter/repository/player/index'
import { TechnologyRepository } from '#app/port/repository/technology'
import { MongoTechnologyRepository } from '#adapter/repository/technology/index'
import { Repository } from '#app/port/repository/generic'
import { CellRepository } from '#app/port/repository/cell'
import { MongoCellRepository } from '#adapter/repository/cell/index'
import { TroupRepository } from '#app/port/repository/troup'
import { MongoTroupRepository } from '#adapter/repository/troup/index'

export class MongoRepository implements Repository {
  auth: AuthRepository
  building: BuildingRepository
  cell: CellRepository
  city: CityRepository
  player: PlayerRepository
  technology: TechnologyRepository
  troup: TroupRepository

  constructor() {
    this.auth = new MongoAuthRepository()
    this.building = new MongoBuildingRepository()
    this.cell = new MongoCellRepository()
    this.city = new MongoCityRepository()
    this.player = new MongoPlayerRepository()
    this.technology = new MongoTechnologyRepository()
    this.troup = new MongoTroupRepository()
  }

  async connect(): Promise<void> {
    const logger = Factory.getLogger('adapter:repository')
    logger.info('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'swarm' })
    logger.info('connected to database')
  }
}
