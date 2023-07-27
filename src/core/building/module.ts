import { BuildingCommands } from '#core/building/commands'
import { BuildingService } from '#core/building/domain/service'
import { BuildingQueries } from '#core/building/queries'
import { Factory } from '#core/factory'
import { Module } from '#shared/module'

export class BuildingModule extends Module<BuildingQueries, BuildingCommands> {
  private static instance: BuildingModule

  constructor({
    queries,
    commands
  }: {
    queries: BuildingQueries,
    commands: BuildingCommands
  }) {
    super({
      queries,
      commands
    })
  }

  static getInstance(): BuildingModule {
    if (!this.instance) {
      const service = new BuildingService()
      const repository = Factory.getRepository().building
      const queries = new BuildingQueries({ repository })
      const commands = new BuildingCommands({
        service,
        repository
      })
      this.instance = new BuildingModule({
        commands,
        queries
      })
    }

    return this.instance
  }
}
