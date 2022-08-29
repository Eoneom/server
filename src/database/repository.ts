import { BuildingModel } from './models/building/document'
import { BuildingRepository } from '../core/building/repository'
import { CityModel } from './models/city/document'
import { CityRepository } from '../core/city/repository'
import { MongoBuildingRepository } from './models/building/repository'
import { MongoCityRepository } from './models/city/repository'
import { Repository } from '../core/shared/repository'
import mongoose from 'mongoose'

export class MongoRepository implements Repository {
  city: CityRepository
  building: BuildingRepository

  constructor() {
    this.city = new MongoCityRepository(CityModel)
    this.building = new MongoBuildingRepository(BuildingModel)
  }

  async connect(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: 'swarm'
    })

    console.log('connected to database')
  }
}


