import { GenericResponse } from '../../response'

import { CellType } from '../../../../src/core/world/value/cell-type'

export interface WorldGetSectorRequest {
  sector: number
}

export interface WorldGetSectorDataResponse {
  cells: {
    coordinates: {
      x: number
      y: number
    }
    type: CellType
  }[]
}

export type WorldGetSectorResponse = GenericResponse<WorldGetSectorDataResponse>
