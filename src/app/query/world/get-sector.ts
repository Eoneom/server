import { CellEntity } from '#core/world/cell.entity'
import { GenericQuery } from '#query/generic'

interface WorldGetSectorQueryRequest {
  sector: number
}

export interface WorldGetSectorQueryResponse {
  cells: CellEntity[]
}

export class WorldGetSectorQuery extends GenericQuery<WorldGetSectorQueryRequest, WorldGetSectorQueryResponse> {
  async get({ sector }: WorldGetSectorQueryRequest): Promise<WorldGetSectorQueryResponse> {
    const cells = await this.repository.cell.getSector({ sector })

    return { cells }
  }
}
