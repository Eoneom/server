import { TroopCode } from '#core/troop/constant/code'
import {
  getModelForClass,
  modelOptions,
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

  @prop({ required: true })
  public started_at!: number
}

@modelOptions({ schemaOptions: { collection: 'troups' } })
class Troop {
  @prop({ required: true })
  public code!: TroopCode

  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop()
  public cell_id?: mongoose.Types.ObjectId

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

export type TroopDocument = Document & Troop
export const TroopModel = getModelForClass(Troop)
