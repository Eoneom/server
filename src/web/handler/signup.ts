import { NextFunction, Request, Response } from 'express'
import { App } from '../../app'
import { GenericResponse } from '../responses'

interface SignupRequest {
  player_name: string
}

type SignupResponse = GenericResponse<{
  player_id: string
  city_id: string
}>

export const signup_handler = (app: App) => async (req: Request<SignupRequest>, res: Response<SignupResponse>, next: NextFunction) => {
  const player_name = req.body.player_name
  if (!player_name) {
    return res.status(400).json({ status: 'nok', error_code: 'player_name:not-found'})
  }

  const city_name = req.body.city_name
  if (!city_name) {
    return res.status(400).json({ status: 'nok', error_code: 'city_name:not-found'})
  }
  try {
    const { player_id, city_id } = await app.commands.signup({ player_name, city_name })
    return res.status(200).send({
      status: 'ok',
      data: { player_id, city_id }
    })
  } catch (err) {
    next(err)
  }
}
