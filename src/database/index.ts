import { CityRepository } from '../core/city/repository'
import { MongoCityRepository } from './models/city/repository'
import { Repository } from '../core/shared/repository'
import mongoose from 'mongoose'

export class MongoRepository implements Repository {
  public city: CityRepository

  public constructor() {
    this.city = new MongoCityRepository()
  }

  public async connect(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: 'swarm'
    })

    console.log('connected to database')
  }
}
