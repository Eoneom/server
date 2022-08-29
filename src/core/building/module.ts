import { BuildingCommands } from './commands'
import { BuildingQueries } from './queries'
import { Repository } from '../shared/repository'

export class BuildingModule {
  commands: BuildingCommands
  queries: BuildingQueries

  constructor(
    repository: Repository
  ) {
    this.commands = new BuildingCommands(repository)
    this.queries = new BuildingQueries(repository)
  }
}
