import { Factory } from '../factory'
import { Module } from '../../shared/module'
import { TechnologyCommands } from './commands'
import { TechnologyQueries } from './queries'
import { TechnologyService } from './domain/service'

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
