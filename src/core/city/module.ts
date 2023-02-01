import { BuildingEventCode } from '../building/domain/events'
import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { Factory } from '../factory'
import { Module } from '../shared/module'
import { TechnologyEventCode } from '../technology/domain/events'
import { PlayerEventCode } from '../player/domain/events'

export class CityModule extends Module<CityQueries, CityCommands> {
  constructor({
    queries,
    commands
  }: {
    queries: CityQueries,
    commands: CityCommands
  }) {
    super({ queries, commands })

    const eventbus = Factory.getEventBus()
    eventbus.listen(BuildingEventCode.UPGRADE_REQUESTED, payload => this.commands.purchase(payload))
    eventbus.listen(TechnologyEventCode.RESEARCH_REQUESTED, payload => this.commands.purchase(payload))
  }
}
