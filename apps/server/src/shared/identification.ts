import { generateId } from '#adapter/repository/helpers'
import { v4 as uuidv4 } from 'uuid'

export const id = (): string => generateId()

export const FAKE_ID = 'fake'

export const generateToken = (): string => uuidv4()
