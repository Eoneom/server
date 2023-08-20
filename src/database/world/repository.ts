import { CellEntity } from '#core/world/entity'
import { WorldRepository } from '#app/repository/world'
import {
  CellDocument, CellModel
} from '#database/world/document'
import { MongoGenericRepository } from '#database/generic'
import { WorldError } from '#core/world/error'
import { Coordinates } from '#core/world/value/coordinates'

export class MongoWorldRepository
  extends MongoGenericRepository<typeof CellModel, CellDocument, CellEntity>
  implements WorldRepository {

  async getCityCellsCount({ city_id }: { city_id: string }): Promise<number> {
    return this.model.countDocuments({ city_id })
  }

  async getCityCell({ city_id }: { city_id: string }): Promise<CellEntity> {
    return this.findOneOrThrow({ city_id })
  }

  async getCell({ coordinates }: { coordinates: Coordinates }): Promise<CellEntity> {
    return this.findOneOrThrow({
      'coordinates.x': coordinates.x,
      'coordinates.y': coordinates.y,
      'coordinates.sector': coordinates.sector
    })
  }

  async isInitialized(): Promise<boolean> {
    return this.exists({})
  }

  async getSector({ sector }: { sector: number }): Promise<CellEntity[]> {
    const cells = await this.find({ 'coordinates.sector': sector })
    if (!cells.length) {
      throw new Error(WorldError.SECTOR_NOT_FOUND)
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
      city_id: document.city_id?.toString(),
      resource_coefficient: {
        plastic: document.resource_coefficient.plastic,
        mushroom: document.resource_coefficient.mushroom
      }
    })
  }
}
