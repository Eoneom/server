import { BuildingCode } from './domain/constants'
import { BuildingCommands } from './commands'
import { BuildingEventCode } from './domain/events'
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
    eventbus.listen(BuildingEventCode.REQUEST_UPGRADE_TRIGGERED, payload => this.commands.requestUpgrade(payload))
    eventbus.listen(CityEventCode.PURCHASED, payload => {
      const is_building_purchased = Object
        .values(BuildingCode)
        .includes(payload.code as unknown as BuildingCode)
      if (!is_building_purchased) {
        return
      }

      this.commands.launchUpgrade({
        ...payload,
        code: payload.code as BuildingCode
      })
    })
    eventbus.listen(CityEventCode.SETTLED, payload => this.commands.initFirstBuildings(payload))
  }
}
