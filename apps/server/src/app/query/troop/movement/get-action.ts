import { GenericQuery } from '#query/generic'
import { MovementAction } from '#core/troop/constant/movement-action'

export interface TroopMovementGetActionQueryRequest {
  movement_id: string,
}

export interface TroopMovementGetActionQueryResponse {
  action: MovementAction,
}

export class TroopMovementGetActionQuery extends GenericQuery<TroopMovementGetActionQueryRequest, TroopMovementGetActionQueryResponse> {
  constructor() {
    super({ name: 'troop:movement:get-action' })
  }

  protected async get({ movement_id }: TroopMovementGetActionQueryRequest): Promise<TroopMovementGetActionQueryResponse> {
    const movement = await this.repository.movement.getById(movement_id)

    return { action: movement.action }
  }
}
