import { Factory } from '#core/factory'
import { PlayerCommands } from '#core/player/commands'
import { PlayerQueries } from '#core/player/queries'
import { Module } from '#shared/module'

export class PlayerModule extends Module<PlayerQueries, PlayerCommands> {
  private static instance: PlayerModule

  constructor({
    queries,
    commands
  }: {
    queries: PlayerQueries,
    commands: PlayerCommands
  }) {
    super({
      queries,
      commands 
    })
  }

  static getInstance(): PlayerModule {
    if (!this.instance) {
      const repository = Factory.getRepository().player
      const queries = new PlayerQueries({ repository })
      const commands = new PlayerCommands({ repository })
      this.instance = new PlayerModule({
        commands,
        queries 
      })
    }

    return this.instance
  }
}
