import { PlayerEntity } from './domain/entity'
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

  async init({ name }: PlayerInitCommand): Promise<{ player_id: string}> {
    const player = PlayerEntity.initPlayer({ name })
    const player_id = await this.repository.create(player)
    return { player_id }
  }
}
