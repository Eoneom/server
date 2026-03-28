import { GenericQuery } from '#query/generic'
import { MovementEntity } from '#core/troop/movement/entity'

export interface TroopMovementListQueryRequest {
  player_id: string
}

export interface TroopMovementListQueryResponse {
  movements: MovementEntity[],
}

export class TroopMovementListQuery extends GenericQuery<TroopMovementListQueryRequest, TroopMovementListQueryResponse> {
  constructor() {
    super({ name: 'troop:movement:list' })
  }

  protected async get({ player_id }: TroopMovementListQueryRequest): Promise<TroopMovementListQueryResponse> {
    const movements = await this.repository.movement.list({ player_id })
    return { movements }
  }
}
