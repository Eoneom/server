import { mongoose } from '@typegoose/typegoose'
import { v4 as uuidv4 } from 'uuid'

export const id = (): string => new mongoose.Types.ObjectId().toString()

export const FAKE_ID = 'fake'

export const generateToken = (): string => uuidv4()
