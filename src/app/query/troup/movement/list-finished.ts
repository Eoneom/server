import { GenericQuery } from '#query/generic'

export interface TroupMovementListFinishedQueryRequest {
  player_id: string
}

export interface TroupMovementListFinishedQueryResponse {
  movement_ids: string[],
}

export class TroupMovementListFinishedQuery extends GenericQuery<TroupMovementListFinishedQueryRequest, TroupMovementListFinishedQueryResponse> {
  constructor() {
    super({ name: 'troup:movement:list' })
  }

  protected async get({ player_id }: TroupMovementListFinishedQueryRequest): Promise<TroupMovementListFinishedQueryResponse> {
    const ids = await this.repository.movement.listFinishedIds({ player_id })
    return { movement_ids: ids }
  }
}
