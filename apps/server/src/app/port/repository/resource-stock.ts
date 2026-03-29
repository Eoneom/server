import { GenericRepository } from '#app/port/repository/generic'
import { ResourceStockEntity } from '#core/resources/resource-stock/entity'

export type ResourceStockRepository = GenericRepository<ResourceStockEntity> & {
  getByCellId({ cell_id }: { cell_id: string }): Promise<ResourceStockEntity>
  ensureWorldStockForCell({ cell_id }: { cell_id: string }): Promise<void>
}
