import { CoordinatesDocument } from '#adapter/repository/shared/coordinates'
import { MovementAction } from '#core/troup/constant/movement-action'
import {
  getModelForClass,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Movement {
  @prop({ required: true })
  public player_id!: string

  @prop({
    required: true,
    enum: MovementAction
  })
  public action!: MovementAction

  @prop({ required: true })
  public origin!: CoordinatesDocument

  @prop({ required: true })
  public destination!: CoordinatesDocument

  @prop({ required: true })
  public arrive_at!: number
}

export type MovementDocument = Document & Movement
export const MovementModel = getModelForClass(Movement)
