import mongoose from 'mongoose'

export const connectToDatabase = async (): Promise<any> => {
  return mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'swarm'
  })
}
