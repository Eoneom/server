export type GenericResponse<T> = SuccessResponse<T> | ErrorResponse

export interface SuccessResponse<T> {
  status: 'ok'
  data?: T
}

export interface ErrorResponse {
  status: 'nok'
  error_code: string
}
