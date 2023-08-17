import { CellType } from '#core/world/value/cell-type'
import {
  getModelForClass, modelOptions, prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

@modelOptions({ schemaOptions: { _id: false } })
class Coordinates {
  @prop({ required: true })
  public x!: number

  @prop({ required: true })
  public y!: number

  @prop({ required: true })
  public sector!: number
}

@modelOptions({ schemaOptions: { _id: false } })
class Resource {
  @prop({ required: true })
  public plastic!: number

  @prop({ required: true })
  public mushroom!: number
}

class Cell {
  @prop({ required: true })
  public coordinates!: Coordinates

  @prop({ required: true })
  public type!: CellType

  @prop({ required: true })
  public resource_coefficient!: Resource
}

export type CellDocument = Document & Cell
export const CellModel = getModelForClass(Cell)
