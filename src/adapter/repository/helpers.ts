import { mongoose } from '@typegoose/typegoose'

export const generateId = (): string => new mongoose.Types.ObjectId().toString()
