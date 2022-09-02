import { Factory } from '../factory'
import { Module } from '../shared/module'
import { PlayerEventCode } from '../player/domain/events'
import { TechnologyCommands } from './commands'
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
    eventbus.listen(PlayerEventCode.CREATED, this.commands.init)
  }
}
