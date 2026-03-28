import { Factory } from '#adapter/factory'
import { WorldError } from '#core/world/error'
import { WorldService } from '#core/world/service'

export async function generateWorld(): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:world:generate')
  logger.info('run')

  const is_world_initialized = await repository.cell.isInitialized()
  if (is_world_initialized) {
    throw new Error(WorldError.ALREADY_EXISTS)
  }

  const cells = WorldService.generate()
  await Promise.all(cells.map(cell => repository.cell.create(cell)))
}
