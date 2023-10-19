import { TroupCode } from '#core/troup/constant/code'
import {
  getModelForClass,
  mongoose,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class OngoingRecruitment {
  @prop({ required: true })
  public finish_at!: number

  @prop({ required: true })
  public remaining_count!: number

  @prop({ required: true })
  public last_progress!: number
}

class Troup {
  @prop({ required: true })
  public code!: TroupCode

  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public city_id!: mongoose.Types.ObjectId

  @prop({
    required: true,
    default: 0
  })
  public count!: number

  @prop()
  public ongoing_recruitment?: OngoingRecruitment

  @prop()
  public movement_id?: mongoose.Types.ObjectId
}

export type TroupDocument = Document & Troup
export const TroupModel = getModelForClass(Troup)
