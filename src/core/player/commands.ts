import { BuildingCommands } from '../building/commands'
import { CityCommands } from '../city/commands'
import { CityQueries } from '../city/queries'
import { PlayerEntity } from './domain/entity'
import { PlayerErrors } from './domain/errors'
import { PlayerRepository } from './repository'
import { TechnologyCommands } from '../technology/commands'

interface PlayerInitCommand {
  name: string
  first_city_name: string
}

export class PlayerCommands {
  private repository: PlayerRepository
  private city_commands: CityCommands
  private city_queries: CityQueries
  private building_commands: BuildingCommands
  private technology_commands: TechnologyCommands

  constructor({
    repository,
    city_commands,
    city_queries,
    building_commands,
    technology_commands
  }: {
    repository: PlayerRepository,
    city_commands: CityCommands,
    city_queries: CityQueries,
    building_commands: BuildingCommands
    technology_commands: TechnologyCommands
  }) {
    this.repository = repository
    this.city_commands = city_commands
    this.city_queries = city_queries
    this.building_commands = building_commands
    this.technology_commands = technology_commands
  }

  async init({ name, first_city_name }: PlayerInitCommand): Promise<string> {
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

    await this.technology_commands.init({
      player_id
    })

    const city_id = await this.city_commands.init({
      name: first_city_name,
      player_id
    })

    await this.building_commands.initFirstBuildings({ city_id })

    return player_id
  }
}
