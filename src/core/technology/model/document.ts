import { TechnologyCode } from '#core/technology/domain/constants'
import { getModelForClass, mongoose, prop } from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Technology {
  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public code!: TechnologyCode

  @prop({ required: true })
  public level!: number

  @prop()
  public research_at?: number
}

export type TechnologyDocument = Document & Technology
export const TechnologyModel = getModelForClass(Technology)
