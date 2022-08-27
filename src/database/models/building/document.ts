import { getModelForClass, mongoose, prop } from '@typegoose/typegoose'

import { BuildingEntity } from '../../../core/building/entity'
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

export const fromBuildingEntity = (entity: BuildingEntity): Building => {
  return {
    city_id: new mongoose.Types.ObjectId(entity.city_id),
    code: entity.code,
    level: entity.level,
    upgrade_time: entity.upgrade_time
  }
}

export type BuildingDocument = Document & Building
export const BuildingModel = getModelForClass(Building)
