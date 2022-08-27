import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { CityRepository } from './repository'

export class CityApp {
  commands: CityCommands
  queries: CityQueries

  constructor(repository: CityRepository) {
    this.commands = new CityCommands(repository)
    this.queries = new CityQueries(repository)
  }
}
