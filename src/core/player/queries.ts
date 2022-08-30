import { FilterQuery } from '../../types/database'
import { PlayerEntity } from './domain/entity'
import { PlayerErrors } from './domain/errors'
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

  async findById(id: string): Promise<PlayerEntity | null> {
    return this.repository.findById(id)
  }

  async findOne(query: FilterQuery<PlayerEntity>): Promise<PlayerEntity | null> {
    return this.repository.findOne(query)
  }
}
