import { randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

/** 12-byte random id as 24 hex chars (MongoDB ObjectId-compatible string). */
export const id = (): string => randomBytes(12).toString('hex')

export const FAKE_ID = 'fake'

export const generateToken = (): string => uuidv4()
