import { GenericQuery } from '#query/generic'
import { Coordinates } from '#core/world/value/coordinates'
import { TroopCode } from '#core/troop/constant/code'
import { WorldService } from '#core/world/service'
import { TroopService } from '#core/troop/service'

export interface TroopMovementEstimateQueryRequest {
  origin: Coordinates
  destination: Coordinates
  troop_codes: TroopCode[]
}

export interface TroopMovementEstimateQueryResponse {
  distance: number
  duration: number
  speed: number
}

export class TroopMovementEstimateQuery extends GenericQuery<TroopMovementEstimateQueryRequest, TroopMovementEstimateQueryResponse> {
  constructor() {
    super({ name: 'troop:movement:estimate' })
  }

  protected async get({
    origin,
    destination,
    troop_codes
  }: TroopMovementEstimateQueryRequest): Promise<TroopMovementEstimateQueryResponse> {
    await this.repository.cell.getCell({ coordinates: origin })
    await this.repository.cell.getCell({ coordinates: destination })

    const distance = WorldService.getDistance({
      origin: destination,
      destination: origin
    })

    const duration = TroopService.getMovementDuration({
      distance,
      troop_codes
    })

    const speed = TroopService.getSlowestSpeed({ troop_codes })

    return {
      distance,
      speed,
      duration: duration / 1000
    }
  }
}
