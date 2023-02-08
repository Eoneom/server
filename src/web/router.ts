import { Router } from 'express'
import { App } from '../core/app'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send('Hello world')
  })

  return r
}

