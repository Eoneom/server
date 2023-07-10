import { BuildingCommands } from './commands'
import { BuildingQueries } from './queries'
import { Module } from '../shared/module'

export class BuildingModule extends Module<BuildingQueries, BuildingCommands> {
  constructor({
    queries,
    commands
  }: {
    queries: BuildingQueries,
    commands: BuildingCommands
  }) {
    super({ queries, commands })
  }
}
