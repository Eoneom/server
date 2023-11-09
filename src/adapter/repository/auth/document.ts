import {
  getModelForClass, mongoose, prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Auth {
  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public token!: string

  @prop({ required: true })
  public last_action_at!: number
}

export type AuthDocument = Document & Auth
export const AuthModel = getModelForClass(Auth)
