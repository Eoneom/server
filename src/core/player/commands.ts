import { PlayerEntity } from '#core/player/domain/entity'
import { PlayerErrors } from '#core/player/domain/errors'
import { PlayerRepository } from '#core/player/model'

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

  async init({ name }: PlayerInitCommand): Promise<PlayerEntity> {
    const existing_player = await this.repository.exists({ name })
    if (existing_player) {
      throw new Error(PlayerErrors.ALREADY_EXISTS)
    }

    return PlayerEntity.initPlayer({ name })
  }
}
