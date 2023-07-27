import { AuthErrors } from '#core/auth/errors'
import { AuthRepository } from '#core/auth/model'
import { AuthModel } from '#core/auth/model/document'
import { MongoAuthRepository } from '#core/auth/model/mongo'
import { BuildingErrors } from '#core/building/errors'
import { BuildingRepository } from '#core/building/model'
import { BuildingModel } from '#core/building/model/document'
import { MongoBuildingRepository } from '#core/building/model/mongo'
import { CityErrors } from '#core/city/errors'
import { CityRepository } from '#core/city/model'
import { CityModel } from '#core/city/model/document'
import { MongoCityRepository } from '#core/city/model/mongo'
import { PlayerErrors } from '#core/player/errors'
import { PlayerRepository } from '#core/player/model'
import { PlayerModel } from '#core/player/model/document'
import { MongoPlayerRepository } from '#core/player/model/mongo'
import { TechnologyErrors } from '#core/technology/errors'
import { TechnologyRepository } from '#core/technology/model'
import { TechnologyModel } from '#core/technology/model/document'
import { MongoTechnologyRepository } from '#core/technology/model/mongo'
import { Repository } from '#shared/repository'
import { mongoose } from '@typegoose/typegoose'


export class MongoRepository implements Repository {
  auth: AuthRepository
  building: BuildingRepository
  city: CityRepository
  player: PlayerRepository
  technology: TechnologyRepository

  constructor() {
    this.auth = new MongoAuthRepository(AuthModel, AuthErrors.NOT_FOUND)
    this.building = new MongoBuildingRepository(BuildingModel, BuildingErrors.NOT_FOUND)
    this.city = new MongoCityRepository(CityModel, CityErrors.NOT_FOUND)
    this.player = new MongoPlayerRepository(PlayerModel, PlayerErrors.NOT_FOUND)
    this.technology = new MongoTechnologyRepository(TechnologyModel, TechnologyErrors.NOT_FOUND)
  }

  async connect(): Promise<void> {
    console.log('connecting to database...')
    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'swarm' })

    console.log('connected to database')
  }
}


