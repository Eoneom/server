import { Factory } from '#core/factory'
import { TechnologyCommands } from '#core/technology/commands'
import { TechnologyService } from '#core/technology/domain/service'
import { TechnologyQueries } from '#core/technology/queries'
import { Module } from '#shared/module'

export class TechnologyModule extends Module<TechnologyQueries, TechnologyCommands> {
  private static instance: TechnologyModule

  constructor({
    queries,
    commands
  }: {
    queries: TechnologyQueries,
    commands: TechnologyCommands
  }) {
    super({ queries, commands })
  }

  static getInstance(): TechnologyModule {
    if (!this.instance) {
      const repository = Factory.getRepository().technology
      const service = new TechnologyService()
      const commands = new TechnologyCommands({
        repository,
        service
      })
      const queries = new TechnologyQueries({ repository })
      this.instance = new TechnologyModule({
        commands,
        queries,
      })
    }

    return this.instance
  }
}
