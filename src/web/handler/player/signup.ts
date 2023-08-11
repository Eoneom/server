import {
  NextFunction, Request, Response
} from 'express'
import {
  SignupRequest, SignupResponse
} from '#client/src/endpoints/player/signup'
import { AuthSignupCommand } from '#command/auth/signup'

export const signupHandler = async (
  req: Request<SignupRequest>,
  res: Response<SignupResponse>,
  next: NextFunction
) => {
  const player_name = req.body.player_name
  if (!player_name) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'player_name:not-found'
    })
  }

  const city_name = req.body.city_name
  if (!city_name) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_name:not-found'
    })
  }

  try {
    const command = new AuthSignupCommand()
    const {
      player_id, city_id
    } = await command.run({
      player_name,
      city_name
    })
    return res.status(200).send({
      status: 'ok',
      data: {
        player_id,
        city_id
      }
    })
  } catch (err) {
    next(err)
  }
}
