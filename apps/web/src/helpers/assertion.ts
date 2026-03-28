import { ErrorResponse, GenericResponse } from '@kroust/swarm-client'

export const isError = (res: GenericResponse<unknown>): res is ErrorResponse => {
  return res.status === 'nok'
}
