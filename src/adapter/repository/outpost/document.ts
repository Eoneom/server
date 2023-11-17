import { OutpostType } from '#core/outpost/constant/type'

import {
  getModelForClass,
  mongoose,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Outpost {
  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public cell_id!: mongoose.Types.ObjectId

  @prop({
    required: true,
    enum: OutpostType
  })
  public type!: OutpostType
}

export type OutpostDocument = Document & Outpost
export const OutpostModel = getModelForClass(Outpost)
