import { OutpostEntity } from '#core/outpost/entity'
import { GenericQuery } from '#query/generic'
import { CellEntity } from '#core/world/cell.entity'

export interface OutpostListQueryRequest {
  player_id: string
}

export interface OutpostListQueryResponse {
  outposts: OutpostEntity[]
  cells: CellEntity[]
}

export class OutpostListQuery extends GenericQuery<OutpostListQueryRequest, OutpostListQueryResponse> {
  async get({ player_id }: OutpostListQueryRequest): Promise<OutpostListQueryResponse> {
    const outposts = await this.repository.outpost.list({ player_id })
    const cells = await Promise.all(outposts.map(outpost => this.repository.cell.getById(outpost.cell_id)))
    return {
      outposts,
      cells
    }
  }
}
