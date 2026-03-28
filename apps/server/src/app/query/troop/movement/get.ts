import { GenericQuery } from '#query/generic'
import { MovementEntity } from '#core/troop/movement/entity'
import { TroopEntity } from '#core/troop/entity'
import { TroopError } from '#core/troop/error'

export interface TroopMovementGetQueryRequest {
  player_id: string
  movement_id: string
}

export interface TroopMovementGetQueryResponse {
  movement: MovementEntity
  troops: TroopEntity[]
}

export class TroopMovementGetQuery extends GenericQuery<TroopMovementGetQueryRequest, TroopMovementGetQueryResponse> {
  constructor() {
    super({ name: 'troop:movement:get' })
  }

  protected async get({
    player_id,
    movement_id
  }: TroopMovementGetQueryRequest): Promise<TroopMovementGetQueryResponse> {
    const movement = await this.repository.movement.getById(movement_id)
    if (!movement.isOwnedBy(player_id)) {
      throw new Error(TroopError.MOVEMENT_NOT_FOUND)
    }

    const troops = await this.repository.troop.listByMovement({ movement_id })

    return {
      movement,
      troops
    }
  }
}
