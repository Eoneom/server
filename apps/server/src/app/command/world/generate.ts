import { Factory } from '#adapter/factory'
import { WorldError } from '#core/world/error'
import { WorldService } from '#core/world/service'
import { ResourceStockEntity } from '#core/resources/resource-stock/entity'
import { now } from '#shared/time'

export async function generateWorld(): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:world:generate')
  logger.info('run')

  const is_world_initialized = await repository.cell.isInitialized()
  if (is_world_initialized) {
    throw new Error(WorldError.ALREADY_EXISTS)
  }

  const cells = WorldService.generate()
  const gather_at = now()
  for (const cell of cells) {
    const cell_id = await repository.cell.create(cell)
    const stock = ResourceStockEntity.initForWorldCell({
      cell_id,
      gather_at
    })
    await repository.resource_stock.create(stock)
  }
}
