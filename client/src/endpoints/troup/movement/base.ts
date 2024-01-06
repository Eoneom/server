import { TroupCode } from '../../../../../src/core/troup/constant/code'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

export interface TroupBaseRequest {
  origin: Coordinates
  destination: Coordinates
  troups: {
    code: TroupCode
    count: number
  }[]
}

export type TroupBaseResponse = GenericResponse<void>
