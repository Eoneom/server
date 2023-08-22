import {
  getModelForClass, prop 
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class Player {
  @prop({ required: true })
  public name!: string
}

export type PlayerDocument = Document & Player
export const PlayerModel = getModelForClass(Player)
