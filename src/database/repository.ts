import { AuthError } from '#core/auth/error'
import { AuthRepository } from '#app/repository/auth'
import { AuthModel } from '#database/auth/document'
import { MongoAuthRepository } from '#database/auth/repository'
import { BuildingError } from '#core/building/error'
import { BuildingRepository } from '#app/repository/building'
import { BuildingModel } from '#database/building/document'
import { MongoBuildingRepository } from '#database/building/repository'
import { CityError } from '#core/city/error'
import { CityRepository } from '#app/repository/city'
import { CityModel } from '#database/city/document'
import { MongoCityRepository } from '#database/city/repository'
import { PlayerError } from '#core/player/error'
import { PlayerRepository } from '#app/repository/player'
import { PlayerModel } from '#database/player/document'
import { MongoPlayerRepository } from '#database/player/repository'
import { TechnologyError } from '#core/technology/error'
import { TechnologyRepository } from '#app/repository/technology'
import { TechnologyModel } from '#database/technology/document'
import { MongoTechnologyRepository } from '#database/technology/repository'
import { Repository } from '#app/repository/generic'
import { mongoose } from '@typegoose/typegoose'
import { WorldRepository } from '#app/repository/world'
import { MongoWorldRepository } from '#database/world/repository'
import { CellModel } from '#database/world/document'
import { WorldError } from '#core/world/error'

export class MongoRepository implements Repository {
  auth: AuthRepository
  building: BuildingRepository
  city: CityRepository
  player: PlayerRepository
  technology: TechnologyRepository
  world: WorldRepository

  constructor() {
    this.auth = new MongoAuthRepository(AuthModel, AuthError.NOT_FOUND)
    this.building = new MongoBuildingRepository(BuildingModel, BuildingError.NOT_FOUND)
    this.city = new MongoCityRepository(CityModel, CityError.NOT_FOUND)
    this.player = new MongoPlayerRepository(PlayerModel, PlayerError.NOT_FOUND)
    this.technology = new MongoTechnologyRepository(TechnologyModel, TechnologyError.NOT_FOUND)
    this.world = new MongoWorldRepository(CellModel, WorldError.NOT_FOUND)
  }

  async connect(): Promise<void> {
    console.log('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'swarm' })

    console.log('connected to database')
  }
}


