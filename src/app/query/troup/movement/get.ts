import { GenericQuery } from '#query/generic'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'

export interface TroupMovementGetQueryRequest {
  player_id: string
  movement_id: string
}

export interface TroupMovementGetQueryResponse {
  movement: MovementEntity
  troups: TroupEntity[]
}

export class TroupMovementGetQuery extends GenericQuery<TroupMovementGetQueryRequest, TroupMovementGetQueryResponse> {
  constructor() {
    super({ name: 'troup:movement:get' })
  }

  protected async get({
    player_id,
    movement_id
  }: TroupMovementGetQueryRequest): Promise<TroupMovementGetQueryResponse> {
    const movement = await this.repository.movement.getById(movement_id)
    if (!movement.isOwnedBy(player_id)) {
      throw new Error(TroupError.MOVEMENT_NOT_FOUND)
    }

    const troups = await this.repository.troup.listByMovement({ movement_id })

    return {
      movement,
      troups
    }
  }
}
