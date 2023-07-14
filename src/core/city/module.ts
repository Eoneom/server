import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { Module } from '../../shared/module'
import { Factory } from '../factory'

export class CityModule extends Module<CityQueries, CityCommands> {
  private static instance: CityModule

  constructor({
    queries,
    commands
  }: {
    queries: CityQueries,
    commands: CityCommands
  }) {
    super({ queries, commands })
  }

  static getInstance(): CityModule {
    if (!this.instance) {
      const repository = Factory.getRepository().city
      const commands = new CityCommands({ repository})
      const queries = new CityQueries({ repository })
      this.instance = new CityModule({
        commands,
        queries
      })
    }
    return this.instance
  }
}
