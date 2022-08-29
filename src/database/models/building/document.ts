import { getModelForClass, mongoose, prop } from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Building {
  @prop({ required: true })
  public city_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public code!: string

  @prop({ required: true })
  public level!: number

  @prop()
  public upgrade_time?: number
}

export type BuildingDocument = Document & Building
export const BuildingModel = getModelForClass(Building)
