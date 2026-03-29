import {
  getModelForClass, mongoose, prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class City {
  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public name!: string
}

export type CityDocument = Document & City
export const CityModel = getModelForClass(City)
