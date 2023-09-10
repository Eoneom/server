import { CoordinatesDocument } from '#adapter/repository/shared/coordinates'
import {
  getModelForClass,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Movement {
  @prop({ required: true })
  public origin!: CoordinatesDocument

  @prop({ required: true })
  public destination!: CoordinatesDocument

  @prop({ required: true })
  public arrive_at!: number
}

export type MovementDocument = Document & Movement
export const MovementModel = getModelForClass(Movement)
