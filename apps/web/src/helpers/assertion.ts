import { ErrorResponse, GenericResponse } from '@eoneom/api-client'

export const isError = (res: GenericResponse<unknown>): res is ErrorResponse => {
  return res.status === 'nok'
}
