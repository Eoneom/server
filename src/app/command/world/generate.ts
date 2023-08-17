import { GenericCommand } from '#app/command/generic'
import { CellEntity } from '#core/world/entity'
import { WorldErrors } from '#core/world/errors'
import { WorldService } from '#core/world/service'

interface WorldGenerateExec {
  is_world_initialized: boolean
}

interface WorldGenerateSave {
  cells: CellEntity[]
}

export class WorldGenerateCommand extends GenericCommand<
  void,
  WorldGenerateExec,
  WorldGenerateSave
> {
  async fetch(): Promise<WorldGenerateExec> {
    const is_world_initialized = await this.repository.world.isInitialized()
    return { is_world_initialized }
  }
  exec({ is_world_initialized }: WorldGenerateExec): WorldGenerateSave {
    if (is_world_initialized) {
      throw new Error(WorldErrors.ALREADY_EXISTS)
    }
    const cells = WorldService.generate()
    return { cells }
  }
  async save({ cells }: WorldGenerateSave): Promise<void> {
    await Promise.all(cells.map(cell => this.repository.world.create(cell)))
  }

}
