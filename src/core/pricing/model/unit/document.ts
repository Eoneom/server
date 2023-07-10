import { getModelForClass, prop, Severity } from '@typegoose/typegoose'

import { Document } from 'mongoose'
import { Resource } from '../../../../shared/resource'

class UnitCost {
  @prop({ required: true })
  public code!: string

  @prop({ required: true })
  public level!: number

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public resource!: Resource

  @prop({ required: true })
  public duration!: number
}

export type UnitCostDocument = Document & UnitCost
export const UnitCostModel = getModelForClass(UnitCost)
