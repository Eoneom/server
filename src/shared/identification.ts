import { mongoose } from '@typegoose/typegoose'

export const id = (): string => new mongoose.Types.ObjectId().toString()

export const FAKE_ID = 'fake'
