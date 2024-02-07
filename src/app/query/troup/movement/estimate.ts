import { GenericQuery } from '#query/generic'
import { Coordinates } from '#core/world/value/coordinates'
import { TroupCode } from '#core/troup/constant/code'
import { WorldService } from '#core/world/service'
import { TroupService } from '#core/troup/service'

export interface TroupMovementEstimateQueryRequest {
  origin: Coordinates
  destination: Coordinates
  troup_codes: TroupCode[]
}

export interface TroupMovementEstimateQueryResponse {
  distance: number
  duration: number
  speed: number
}

export class TroupMovementEstimateQuery extends GenericQuery<TroupMovementEstimateQueryRequest, TroupMovementEstimateQueryResponse> {
  constructor() {
    super({ name: 'troup:movement:estimate' })
  }

  protected async get({
    origin,
    destination,
    troup_codes
  }: TroupMovementEstimateQueryRequest): Promise<TroupMovementEstimateQueryResponse> {
    await this.repository.cell.getCell({ coordinates: origin })
    await this.repository.cell.getCell({ coordinates: destination })

    const distance = WorldService.getDistance({
      origin: destination,
      destination: origin
    })

    const duration = TroupService.getMovementDuration({
      distance,
      troup_codes
    })

    const speed = TroupService.getSlowestSpeed({ troup_codes })

    return {
      distance,
      speed,
      duration: duration / 1000
    }
  }
}
