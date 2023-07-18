import { BuildingCode } from '#core/building/domain/constants'
import { getModelForClass, mongoose, prop } from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Building {
  @prop({ required: true })
  public city_id!: mongoose.Types.ObjectId

  @prop({ required: true, enum: BuildingCode })
  public code!: BuildingCode

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public level!: number

  @prop()
  public upgrade_at?: number
}

export type BuildingDocument = Document & Building
export const BuildingModel = getModelForClass(Building)
