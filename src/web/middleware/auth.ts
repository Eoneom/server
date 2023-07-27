import { Queries } from '#app/queries'
import { Factory } from '#app/factory'
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
    const queries = new Queries({ repository: Factory.getRepository() })
    const { player_id } = await queries.authorize({ token })
    res.locals.player_id = player_id
    next()

  } catch (err) {
    next(err)
  }
}
