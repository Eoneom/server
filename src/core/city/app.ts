import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { CityRepository } from './repository'

export class CityApp {
  public commands: CityCommands
  public queries: CityQueries

  public constructor(repository: CityRepository) {
    this.commands = new CityCommands(repository)
    this.queries = new CityQueries(repository)
  }
}
