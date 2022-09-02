import { CityCommands } from '../city/commands'
import { CityQueries } from '../city/queries'
import { Factory } from '../factory'
import { PlayerEntity } from './domain/entity'
import { PlayerErrors } from './domain/errors'
import { PlayerEventCode } from './domain/events'
import { PlayerRepository } from './repository'

interface PlayerInitCommand {
  name: string
  first_city_name: string
}

export class PlayerCommands {
  private repository: PlayerRepository
  private city_commands: CityCommands
  private city_queries: CityQueries

  constructor({
    repository,
    city_commands,
    city_queries,
  }: {
    repository: PlayerRepository,
    city_commands: CityCommands,
    city_queries: CityQueries,
  }) {
    this.repository = repository
    this.city_commands = city_commands
    this.city_queries = city_queries
  }

  async init({ name, first_city_name }: PlayerInitCommand): Promise<void> {
    const does_player_with_same_name_exists = await this.repository.findOne({ name })
    if (does_player_with_same_name_exists) {
      throw new Error(PlayerErrors.ALREADY_EXISTS)
    }

    const can_build_city = await this.city_queries.canBuild({ name: first_city_name })
    if (!can_build_city) {
      throw new Error(PlayerErrors.CAN_NOT_BUILD_FIRST_CITY)
    }

    const player = PlayerEntity.initPlayer({ name })
    const player_id = await this.repository.create(player)

    console.log('launch settle command')
    await this.city_commands.settle({
      name: first_city_name,
      player_id
    })

    console.log('player created')
    Factory.getEventBus().emit(PlayerEventCode.CREATED, { player_id })
  }
}
