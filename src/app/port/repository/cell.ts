import { GenericRepository } from '#app/port/repository/generic'
import { CellEntity } from '#core/world/cell.entity'
import { Coordinates } from '#core/world/value/coordinates'

export type CellRepository = GenericRepository<CellEntity> & {
  isInitialized(): Promise<boolean>
  getSector(query: { sector: number }): Promise<CellEntity[]>
  getCityCell(query: { city_id: string }): Promise<CellEntity>
  getCityCellsCount(query: { city_id: string }): Promise<number>
  getCell(query: { coordinates: Coordinates }): Promise<CellEntity>
}
