import { BuildingCommands } from './commands'
import { BuildingQueries } from './queries'
import { CityEventCode } from '../city/domain/events'
import { Factory } from '../factory'
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

    const eventbus = Factory.getEventBus()
    eventbus.listen(CityEventCode.BUILDING_PURCHASED, this.commands.launchUpgrade)
    eventbus.listen(CityEventCode.SETTLED, this.commands.initFirstBuildings)
  }
}
