import { BuildingRepository } from '../core/building/repository'
import { CityRepository } from '../core/city/repository'
import { MongoBuildingRepository } from './models/building/repository'
import { MongoCityRepository } from './models/city/repository'
import { Repository } from '../core/shared/repository'
import mongoose from 'mongoose'

export class MongoRepository implements Repository {
  city: CityRepository
  building: BuildingRepository

  constructor() {
    this.city = new MongoCityRepository()
    this.building = new MongoBuildingRepository()
  }

  async connect(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: 'swarm'
    })

    console.log('connected to database')
  }
}
