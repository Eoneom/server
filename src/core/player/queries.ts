import { PlayerEntity } from '#core/player/domain/entity'
import { PlayerErrors } from '#core/player/domain/errors'
import { PlayerRepository } from '#core/player/model'
import { FilterQuery } from '#type/database'

export class PlayerQueries {
  private repository: PlayerRepository

  constructor({
    repository
  }: {
    repository: PlayerRepository
  }) {
    this.repository = repository
  }

  async findByIdOrThrow(id: string): Promise<PlayerEntity> {
    const player = await this.repository.findById(id)
    if (!player) {
      throw new Error(PlayerErrors.NOT_FOUND)
    }

    return player
  }

  async findById(id: string): Promise<PlayerEntity | null> {
    return this.repository.findById(id)
  }

  async findOne(query: FilterQuery<PlayerEntity>): Promise<PlayerEntity | null> {
    return this.repository.findOne(query)
  }
}
