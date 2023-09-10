import { GenericQuery } from '#query/generic'
import { MovementAction } from '#core/troup/constant'

export interface TroupGetMovementActionQueryRequest {
  movement_id: string,
}

export interface TroupGetMovementActionQueryResponse {
  action: MovementAction,
}

export class TroupGetMovementActionQuery extends GenericQuery<TroupGetMovementActionQueryRequest, TroupGetMovementActionQueryResponse> {
  async get({ movement_id }: TroupGetMovementActionQueryRequest): Promise<TroupGetMovementActionQueryResponse> {
    const movement = await this.repository.movement.get(movement_id)

    return { action: movement.action }
  }
}
