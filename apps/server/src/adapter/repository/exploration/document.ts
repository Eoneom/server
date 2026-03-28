import {
  getModelForClass,
  mongoose,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Exploration {
  @prop({ required: true })
  public player_id!: string

  @prop({
    required: true,
    type: [ mongoose.Types.ObjectId ]
  })
  public cell_ids!: mongoose.Types.Array<mongoose.Types.ObjectId>
}

export type ExplorationDocument = Document & Exploration
export const ExplorationModel = getModelForClass(Exploration)
