import { NextFunction, Request, Response } from 'express'
import { App } from '../../app'
import { GenericResponse } from '../responses'

interface RefreshRequest {
  player_id: string
}

type RefreshResponse = GenericResponse<undefined>

export const refresh_handler = (app: App) => async (req: Request<RefreshRequest>, res: Response<RefreshResponse>, next: NextFunction) => {
  // TODO: take player id from authentication
  const player_id = req.body.player_id
  if (!player_id) {
    return res.status(401).json({ status: 'nok', error_code: 'player_id:not-found'})
  }

  try {
    await app.commands.refresh({ player_id })
    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
