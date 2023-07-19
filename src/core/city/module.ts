import { CityCommands } from '#core/city/commands'
import { CityQueries } from '#core/city/queries'
import { Factory } from '#core/factory'
import { Module } from '#shared/module'

export class CityModule extends Module<CityQueries, CityCommands> {
  private static instance: CityModule

  constructor({
    queries,
    commands
  }: {
    queries: CityQueries,
    commands: CityCommands
  }) {
    super({
      queries,
      commands 
    })
  }

  static getInstance(): CityModule {
    if (!this.instance) {
      const repository = Factory.getRepository().city
      const commands = new CityCommands({ repository })
      const queries = new CityQueries({ repository })
      this.instance = new CityModule({
        commands,
        queries
      })
    }
    return this.instance
  }
}
