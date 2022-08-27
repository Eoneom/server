import { BuildingCommands } from './commands'
import { BuildingQueries } from './queries'
import { BuildingRepository } from './repository'

export class BuildingApp {
  commands: BuildingCommands
  queries: BuildingQueries

  constructor(
    repository: BuildingRepository
  ) {
    this.commands = new BuildingCommands(repository)
    this.queries = new BuildingQueries(repository)
  }
}
