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
import { ExplorationRepository } from '#app/port/repository/exploration'
import { MongoExplorationRepository } from '#adapter/repository/exploration/index'
import { MovementRepository } from '#app/port/repository/movement'
import { MongoMovementRepository } from '#adapter/repository/movement/index'
import { ReportRepository } from '#app/port/repository/report'
import { MongoReportRepository } from '#adapter/repository/report/index'
import { OutpostRepository } from '#app/port/repository/outpost'
import { MongoOutpostRepository } from '#adapter/repository/outpost/index'

export class MongoRepository implements Repository {
  auth: AuthRepository
  building: BuildingRepository
  cell: CellRepository
  city: CityRepository
  exploration: ExplorationRepository
  movement: MovementRepository
  outpost: OutpostRepository
  player: PlayerRepository
  report: ReportRepository
  technology: TechnologyRepository
  troup: TroupRepository

  constructor() {
    this.auth = new MongoAuthRepository()
    this.building = new MongoBuildingRepository()
    this.cell = new MongoCellRepository()
    this.city = new MongoCityRepository()
    this.exploration = new MongoExplorationRepository()
    this.movement = new MongoMovementRepository()
    this.outpost = new MongoOutpostRepository()
    this.report = new MongoReportRepository()
    this.player = new MongoPlayerRepository()
    this.technology = new MongoTechnologyRepository()
    this.troup = new MongoTroupRepository()
  }

  async connect(): Promise<void> {
    const logger = Factory.getLogger('adapter:repository')
    logger.info('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'eoneom' })
    logger.info('connected to database')
  }
}
