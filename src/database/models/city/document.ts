import { getModelForClass, prop } from '@typegoose/typegoose'

import { Document } from 'mongoose'

class City {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public plastic!: number

  @prop({ required: true })
  public mushroom!: number

  @prop({ required: true })
  public last_plastic_gather!: number

  @prop({ required: true })
  public last_mushroom_gather!: number
}

export type CityDocument = Document & City
export const CityModel = getModelForClass(City)
