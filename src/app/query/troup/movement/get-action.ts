import { GenericQuery } from '#query/generic'
import { MovementAction } from '#core/troup/constant/movement-action'

export interface TroupMovementGetActionQueryRequest {
  movement_id: string,
}

export interface TroupMovementGetActionQueryResponse {
  action: MovementAction,
}

export class TroupMovementGetActionQuery extends GenericQuery<TroupMovementGetActionQueryRequest, TroupMovementGetActionQueryResponse> {
  constructor() {
    super({ name: 'troup:movement:get-action' })
  }

  protected async get({ movement_id }: TroupMovementGetActionQueryRequest): Promise<TroupMovementGetActionQueryResponse> {
    const movement = await this.repository.movement.getById(movement_id)

    return { action: movement.action }
  }
}
