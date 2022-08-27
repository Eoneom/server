import { getModelForClass, prop } from '@typegoose/typegoose'

import { Document } from 'mongoose'

class City {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public wood!: number

  @prop({ required: true })
  public last_wood_gather!: number
}

export type CityDocument = Document & City
export const CityModel = getModelForClass(City)
