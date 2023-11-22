import { CellEntity } from '#core/world/cell.entity'
import { GenericQuery } from '#query/generic'

interface WorldGetSectorQueryRequest {
  sector: number
  player_id: string
}

export interface WorldGetSectorQueryResponse {
  cells: CellEntity[]
  explored_cell_ids: string[]
}

export class WorldGetSectorQuery extends GenericQuery<WorldGetSectorQueryRequest, WorldGetSectorQueryResponse> {
  constructor() {
    super({ name: 'world:sector:get' })
  }

  protected async get({
    sector,
    player_id
  }: WorldGetSectorQueryRequest): Promise<WorldGetSectorQueryResponse> {
    const cells = await this.repository.cell.getSector({ sector })
    const exploration = await this.repository.exploration.get({ player_id })

    return {
      cells,
      explored_cell_ids: exploration.cell_ids
    }
  }
}
