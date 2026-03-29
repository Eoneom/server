import { GenericQuery } from '#query/generic'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostError } from '#core/outpost/error'
import { CellEntity } from '#core/world/cell/entity'
import { ResourceStockEntity } from '#core/resources/resource-stock/entity'

export interface OutpostGetQueryRequest {
  player_id: string
  outpost_id: string
}

export interface OutpostGetQueryResponse {
  outpost: OutpostEntity
  cell: CellEntity
  resource_stock: ResourceStockEntity
}

export class OutpostGetQuery extends GenericQuery<OutpostGetQueryRequest, OutpostGetQueryResponse> {
  constructor() {
    super({ name: 'outpost:get' })
  }

  protected async get({
    player_id,
    outpost_id
  }: OutpostGetQueryRequest): Promise<OutpostGetQueryResponse> {
    const outpost = await this.repository.outpost.getById(outpost_id)
    if (!outpost.isOwnedBy(player_id)) {
      throw new Error(OutpostError.NOT_OWNER)
    }
    const [
      cell,
      resource_stock
    ] = await Promise.all([
      this.repository.cell.getById(outpost.cell_id),
      this.repository.resource_stock.getByCellId({ cell_id: outpost.cell_id })
    ])
    return {
      outpost,
      cell,
      resource_stock
    }
  }
}
