import { GenericRepository } from '#app/repository/generic'
import { CellEntity } from '#core/world/entity'

export type WorldRepository = GenericRepository<CellEntity> & {
  isInitialized(): Promise<boolean>
  getSector(query: { sector: number }): Promise<CellEntity[]>
}
