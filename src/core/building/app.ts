import { BuildingCommands } from './commands'
import { BuildingRepository } from './repository'

export class BuildingApp {
  commands: BuildingCommands

  constructor(
    repository: BuildingRepository
  ) {
    this.commands = new BuildingCommands(repository)
  }
}
