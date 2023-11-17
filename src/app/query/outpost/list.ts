import assert from 'assert'

import { OutpostEntity } from '#core/outpost/entity'
import { Coordinates } from '#core/world/value/coordinates'
import { GenericQuery } from '#query/generic'

export interface OutpostListQueryRequest {
  player_id: string
}

export interface OutpostListQueryResponse {
  outposts: (OutpostEntity & { coordinates: Coordinates })[]
}

export class OutpostListQuery extends GenericQuery<OutpostListQueryRequest, OutpostListQueryResponse> {
  async get({ player_id }: OutpostListQueryRequest): Promise<OutpostListQueryResponse> {
    const outposts = await this.repository.outpost.list({ player_id })
    const outpost_cells = await Promise.all(outposts.map(outpost => this.repository.cell.getById(outpost.cell_id)))
    return {
      outposts: outposts.map(outpost => {
        const cell = outpost_cells.find(cell => cell.id === outpost.cell_id)
        assert(cell)

        return {
          ...outpost,
          coordinates: cell.coordinates
        }
      })
    }
  }
}
