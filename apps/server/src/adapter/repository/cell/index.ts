import { CellEntity } from '#core/world/cell.entity'
import { CellRepository } from '#app/port/repository/cell'
import {
  CellDocument, CellModel
} from '#adapter/repository/cell/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { WorldError } from '#core/world/error'
import { Coordinates } from '#core/world/value/coordinates'

export class MongoCellRepository
  extends MongoGenericRepository<typeof CellModel, CellDocument, CellEntity>
  implements CellRepository {

  constructor() {
    super(CellModel, WorldError.CELL_NOT_FOUND)
  }

  async getById(id: string): Promise<CellEntity> {
    return this.findByIdOrThrow(id)
  }

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
