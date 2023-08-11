import { AuthorizeQuery } from '#query/authorize'
import {
  NextFunction, Request, Response
} from 'express'

export const authMiddleware = async (req: Request<unknown>, res: Response<unknown>, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({
      status: 'nok',
      error_code: 'token:not_found'
    })
  }
  try {
    const query = new AuthorizeQuery()
    const { player_id } = await query.get({ token })
    res.locals.player_id = player_id
    next()

  } catch (err) {
    next(err)
  }
}
