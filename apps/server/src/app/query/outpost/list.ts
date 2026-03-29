import { OutpostEntity } from '#core/outpost/entity'
import { GenericQuery } from '#query/generic'
import { CellEntity } from '#core/world/cell/entity'
import { ResourceStockEntity } from '#core/resources/resource-stock/entity'

export interface OutpostListQueryRequest {
  player_id: string
}

export interface OutpostListQueryResponse {
  outposts: OutpostEntity[]
  cells: CellEntity[]
  resource_stocks: ResourceStockEntity[]
}

export class OutpostListQuery extends GenericQuery<OutpostListQueryRequest, OutpostListQueryResponse> {
  constructor() {
    super({ name: 'outpost:list' })
  }

  protected async get({ player_id }: OutpostListQueryRequest): Promise<OutpostListQueryResponse> {
    const outposts = await this.repository.outpost.list({ player_id })
    const [
      cells,
      resource_stocks
    ] = await Promise.all([
      Promise.all(outposts.map(outpost => this.repository.cell.getById(outpost.cell_id))),
      Promise.all(outposts.map(outpost => this.repository.resource_stock.getByCellId({
        cell_id: outpost.cell_id
      })))
    ])
    return {
      outposts,
      cells,
      resource_stocks
    }
  }
}
