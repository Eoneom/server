import { GenericQuery } from '#query/generic'

export interface TroopMovementListFinishedQueryRequest {
  player_id: string
}

export interface TroopMovementListFinishedQueryResponse {
  movement_ids: string[],
}

export class TroopMovementListFinishedQuery extends GenericQuery<TroopMovementListFinishedQueryRequest, TroopMovementListFinishedQueryResponse> {
  constructor() {
    super({ name: 'troop:movement:list' })
  }

  protected async get({ player_id }: TroopMovementListFinishedQueryRequest): Promise<TroopMovementListFinishedQueryResponse> {
    const ids = await this.repository.movement.listFinishedIds({ player_id })
    return { movement_ids: ids }
  }
}
