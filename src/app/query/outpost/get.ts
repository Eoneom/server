import { GenericQuery } from '#query/generic'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostError } from '#core/outpost/error'
import { CellEntity } from '#core/world/cell.entity'

export interface OutpostGetQueryRequest {
  player_id: string
  outpost_id: string
}

export interface OutpostGetQueryResponse {
  outpost: OutpostEntity
  cell: CellEntity
}

export class OutpostGetQuery extends GenericQuery<OutpostGetQueryRequest, OutpostGetQueryResponse> {
  async get({
    player_id,
    outpost_id
  }: OutpostGetQueryRequest): Promise<OutpostGetQueryResponse> {
    const outpost = await this.repository.outpost.getById(outpost_id)
    if (!outpost.isOwnedBy(player_id)) {
      throw new Error(OutpostError.NOT_OWNER)
    }
    const cell = await this.repository.cell.getById(outpost.cell_id)
    return {
      outpost,
      cell
    }
  }
}
