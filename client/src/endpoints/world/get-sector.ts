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
    characteristic?: {
      type: CellType
      resource_coefficient: {
        plastic: number
        mushroom: number
      }
    }
  }[]
}

export type WorldGetSectorResponse = GenericResponse<WorldGetSectorDataResponse>
