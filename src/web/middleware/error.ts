import { NextFunction, Request, Response } from 'express'
import { ErrorResponse } from '../responses'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
  return res.status(200).json({ status: 'nok', error_code: err.message })
}