import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { Module } from '../shared/module'

export class CityModule extends Module<CityQueries, CityCommands> {
  constructor({
    queries,
    commands
  }: {
    queries: CityQueries,
    commands: CityCommands
  }) {
    super({ queries, commands })
  }
}
