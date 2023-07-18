import { App } from '#app'
import { NextFunction, Request, Response } from 'express'

export const authMiddleware = (app: App) => async (req: Request<unknown>, res: Response<unknown>, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ status: 'nok', error_code: 'token:not_found'})
  }
  const { player_id } = await app.queries.authorize({ token })
  res.locals.player_id = player_id
  next()
}
