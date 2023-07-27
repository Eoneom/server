import {
  NextFunction, Request, Response
} from 'express'
import {
  LoginRequest, LoginResponse
} from '#client/src/endpoints/player/login'
import { LoginCommand } from '#app/command/login'

export const loginHandler = async (
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
    const command = new LoginCommand()
    const { token } = await command.run({ player_name })

    return res.status(200).send({
      status: 'ok',
      data: { token }
    })
  } catch (err) {
    next(err)
  }
}
