import { GenericRepository } from '#app/repository/generic'
import { CellEntity } from '#core/world/entity'
import { Coordinates } from '#core/world/value/coordinates'

export type WorldRepository = GenericRepository<CellEntity> & {
  isInitialized(): Promise<boolean>
  getSector(query: { sector: number }): Promise<CellEntity[]>
  getCityCell(query: { city_id: string }): Promise<CellEntity>
  getCell(query: { coordinates: Coordinates }): Promise<CellEntity>
}
