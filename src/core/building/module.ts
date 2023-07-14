import { BuildingCommands } from './commands'
import { BuildingQueries } from './queries'
import { Module } from '../../shared/module'
import { BuildingService } from './domain/service'
import { Factory } from '../factory'

export class BuildingModule extends Module<BuildingQueries, BuildingCommands> {
  private static instance: BuildingModule

  constructor({
    queries,
    commands
  }: {
    queries: BuildingQueries,
    commands: BuildingCommands
  }) {
    super({ queries, commands })
  }

  static getInstance(): BuildingModule {
    if (!this.instance) {
      const service = new BuildingService()
      const repository = Factory.getRepository().building
      const queries = new BuildingQueries({
        service,
        repository
      })
      const commands = new BuildingCommands({
        service,
        repository
      })
      this.instance = new BuildingModule({ commands, queries })
    }

    return this.instance
  }
}
