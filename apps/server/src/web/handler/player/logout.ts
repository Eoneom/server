import {
  NextFunction,
  Request,
  Response
} from 'express'
import assert from 'assert'

import { LogoutResponse } from '@eoneom/api-client/src/endpoints/player/logout'
import { logoutAuth } from '#command/auth/logout'

export const logoutHandler = async (
  req: Request,
  res: Response<LogoutResponse>,
  next: NextFunction
) => {
  const token = req.headers.authorization
  assert(token)

  try {
    await logoutAuth({ token })
    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
