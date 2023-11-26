import { Factory } from '#adapter/factory'
import { ErrorResponse } from '#client/src/response'
import {
  NextFunction, Request, Response
} from 'express'

const log = Factory.getLogger('middleware:error')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
  log.error(err.message, { stack: err.stack })

  return res.status(200).json({
    status: 'nok',
    error_code: err.message
  })
}
