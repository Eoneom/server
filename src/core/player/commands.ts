import { Factory } from '../factory'
import { PlayerEntity } from './domain/entity'
import { PlayerErrors } from './domain/errors'
import { PlayerEventCode } from './domain/events'
import { PlayerRepository } from './repository'

interface PlayerInitCommand {
  name: string
}

export class PlayerCommands {
  private repository: PlayerRepository

  constructor({
    repository,
  }: {
    repository: PlayerRepository,
  }) {
    this.repository = repository
  }

  async init({ name }: PlayerInitCommand): Promise<void> {
    const does_player_with_same_name_exists = await this.repository.findOne({ name })
    if (does_player_with_same_name_exists) {
      throw new Error(PlayerErrors.ALREADY_EXISTS)
    }

    const player = PlayerEntity.initPlayer({ name })
    const player_id = await this.repository.create(player)

    Factory.getEventBus().emit(PlayerEventCode.CREATED, { player_id })
  }
}
