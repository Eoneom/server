import {
  NextFunction, Request, Response
} from 'express'
import {
  LoginRequest, LoginResponse
} from '#client/src/endpoints/player/login'
import { App } from '#app'

export const loginHandler = (app: App) => async (
  req: Request<LoginRequest>,
  res: Response<LoginResponse>,
  next: NextFunction
) => {
  const player_name = req.body.player_name
  if (!player_name) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'player_name:not-found'
    })
  }

  try {
    const { token } = await app.commands.login({ player_name })
    return res.status(200).send({
      status: 'ok',
      data: { token }
    })
  } catch (err) {
    next(err)
  }
}
