import { Factory } from '../factory'
import { Module } from '../shared/module'
import { TechnologyCommands } from './commands'
import { TechnologyEventCode } from './domain/events'
import { TechnologyQueries } from './queries'

export class TechnologyModule extends Module<TechnologyQueries, TechnologyCommands> {
  constructor({
    queries,
    commands
  }: {
    queries: TechnologyQueries,
    commands: TechnologyCommands
  }) {
    super({ queries, commands })

    const eventbus = Factory.getEventBus()
    eventbus.listen(TechnologyEventCode.REQUEST_RESEARCH_TRIGGERED, payload => this.commands.requestResearch(payload))
  }
}
