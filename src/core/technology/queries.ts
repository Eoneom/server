import { TechnologyCode } from './domain/constants'
import { TechnologyEntity } from './domain/entity'
import { TechnologyRepository } from './model'
import { FilterQuery } from '../../type/database'
import { TechnologyErrors } from './domain/errors'

export class TechnologyQueries {
  private repository: TechnologyRepository

  public constructor({
    repository,
  }: {
    repository: TechnologyRepository
  }) {
    this.repository = repository
  }

  async canResearch({ player_id }: { player_id: string }): Promise<boolean> {
    const technology_in_progress = await this.repository.exists({
      player_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })

    return !technology_in_progress
  }

  async getArchitectureBonus({ player_id }: { player_id: string }): Promise<number> {
    const technology = await this.repository.findOneOrThrow({ player_id, code: TechnologyCode.ARCHITECTURE })
    return technology.level / 100
  }

  async getTechnologies({ player_id }: { player_id: string }): Promise<TechnologyEntity[]> {
    return this.repository.find({ player_id })
  }


  async findOneOrThrow(query: FilterQuery<TechnologyEntity>): Promise<TechnologyEntity> {
    const technology = await this.repository.findOne(query)
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    return technology
  }
}
