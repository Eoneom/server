import { FilterQuery } from '../../types/database'
import { PlayerEntity } from './domain/entity'
import { PlayerRepository } from './repository'

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

  async findById(id: string): Promise<PlayerEntity | null> {
    return this.repository.findById(id)
  }

  async findOne(query: FilterQuery<PlayerEntity>): Promise<PlayerEntity | null> {
    return this.repository.findOne(query)
  }
}
