import { CityEventCode } from '../city/domain/events'
import { Factory } from '../factory'
import { Module } from '../shared/module'
import { PlayerEventCode } from '../player/domain/events'
import { TechnologyCode } from './domain/constants'
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
    eventbus.listen(PlayerEventCode.CREATED, payload => this.commands.init(payload))
    eventbus.listen(TechnologyEventCode.REQUEST_RESEARCH_TRIGGERED, payload => this.commands.requestResearch(payload))
    eventbus.listen(CityEventCode.PURCHASED, payload => {
      const is_technology_purchased = Object
        .values(TechnologyCode)
        .includes(payload.code as unknown as TechnologyCode)
      if (!is_technology_purchased) {
        return
      }

      this.commands.launchResearch({
        ...payload,
        code: payload.code as TechnologyCode
      })
    })
  }
}
