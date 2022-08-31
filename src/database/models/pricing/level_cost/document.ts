import { getModelForClass, prop } from '@typegoose/typegoose'

import { Document } from 'mongoose'
import { Resource } from '../../../../core/shared/resource'

class LevelCost {
  @prop({ required: true })
  public code!: string

  @prop({ required: true })
  public level!: number

  @prop({ required: true })
  public resource!: Resource

  @prop({ required: true })
  public duration!: number
}

export type LevelCostDocument = Document & LevelCost
export const LevelCostModel = getModelForClass(LevelCost)
