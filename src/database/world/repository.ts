import { CellEntity } from '#core/world/entity'
import { WorldRepository } from '#app/repository/world'
import {
  CellDocument, CellModel
} from '#database/world/document'
import { MongoGenericRepository } from '#database/generic'
import { WorldErrors } from '#core/world/errors'

export class MongoWorldRepository
  extends MongoGenericRepository<typeof CellModel, CellDocument, CellEntity>
  implements WorldRepository {

  async isInitialized(): Promise<boolean> {
    return this.exists({})
  }

  async getSector({ sector }: { sector: number }): Promise<CellEntity[]> {
    const cells = await this.find({ 'coordinates.sector': sector })
    if (!cells.length) {
      throw new Error(WorldErrors.SECTOR_NOT_FOUND)
    }

    return cells
  }

  protected buildFromModel(document: CellDocument): CellEntity {
    return CellEntity.create({
      id: document._id.toString(),
      coordinates: {
        x: document.coordinates.x,
        y: document.coordinates.y,
        sector: document.coordinates.sector,
      },
      type: document.type,
      resource_coefficient: {
        plastic: document.resource_coefficient.plastic,
        mushroom: document.resource_coefficient.mushroom
      }
    })
  }
}
