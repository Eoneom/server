import {
  getModelForClass,
  index,
  modelOptions,
  mongoose,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

@modelOptions({ schemaOptions: { collection: 'resource_stocks' } })
@index({ cell_id: 1 }, { unique: true })
class ResourceStock {
  @prop({ required: true })
  public cell_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public plastic!: number

  @prop({ required: true })
  public mushroom!: number

  @prop({ required: true })
  public last_plastic_gather!: number

  @prop({ required: true })
  public last_mushroom_gather!: number
}

export type ResourceStockDocument = Document & ResourceStock
export const ResourceStockModel = getModelForClass(ResourceStock)
