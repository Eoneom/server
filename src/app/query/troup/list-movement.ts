import { GenericQuery } from '#query/generic'
import { MovementEntity } from '#core/troup/movement.entity'

export interface TroupListMovementQueryRequest {
  player_id: string
}

export interface TroupListMovementQueryResponse {
  movements: MovementEntity[],
}

export class TroupListMovementQuery extends GenericQuery<TroupListMovementQueryRequest, TroupListMovementQueryResponse> {
  constructor() {
    super({ name: 'troup:movement:list' })
  }

  protected async get({ player_id }: TroupListMovementQueryRequest): Promise<TroupListMovementQueryResponse> {
    const movements = await this.repository.movement.list({ player_id })
    return { movements }
  }
}
