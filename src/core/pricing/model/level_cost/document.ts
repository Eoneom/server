import { Resource } from '#shared/resource'
import { getModelForClass, prop, Severity } from '@typegoose/typegoose'

import { Document } from 'mongoose'

class LevelCost {
  @prop({ required: true })
  public code!: string

  @prop({ required: true })
  public level!: number

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public resource!: Resource

  @prop({ required: true })
  public duration!: number
}

export type LevelCostDocument = Document & LevelCost
export const LevelCostModel = getModelForClass(LevelCost)
