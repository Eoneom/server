import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { CityRepository } from '../ports/repository/city'
import { Repository } from '../shared/repository'

export class CityModule {
  commands: CityCommands
  queries: CityQueries

  constructor(repository: Repository) {
    this.commands = new CityCommands(repository)
    this.queries = new CityQueries(repository)
  }
}
