import { GenericQuery } from '#query/generic'
import { MovementEntity } from '#core/troup/movement.entity'

export interface TroupMovementListQueryRequest {
  player_id: string
}

export interface TroupMovementListQueryResponse {
  movements: MovementEntity[],
}

export class TroupMovementListQuery extends GenericQuery<TroupMovementListQueryRequest, TroupMovementListQueryResponse> {
  constructor() {
    super({ name: 'troup:movement:list' })
  }

  protected async get({ player_id }: TroupMovementListQueryRequest): Promise<TroupMovementListQueryResponse> {
    const movements = await this.repository.movement.list({ player_id })
    return { movements }
  }
}
