import { FilterQuery } from '../../types/database'
import { PlayerEntity } from './domain/entity'
import { PlayerErrors } from './domain/errors'
import { PlayerRepository } from './model'

export class PlayerQueries {
  private repository: PlayerRepository

  constructor({
    repository
  }: {
    repository: PlayerRepository
  }) {
    this.repository = repository
  }

  async canCreate({ name }: { name: string}): Promise<boolean> {
    const existing_player = await this.repository.exists({ name })
    return !existing_player
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
