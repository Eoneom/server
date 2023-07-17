import { FilterQuery } from 'src/type/database'
import { TechnologyCode } from './domain/constants'
import { TechnologyEntity } from './domain/entity'
import { TechnologyErrors } from './domain/errors'
import { TechnologyRepository } from './model'

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

  async getTechnologies({ player_id }: { player_id: string }): Promise<TechnologyEntity[]> {
    return this.repository.find({ player_id })
  }

  async getLevel({ city_id, code }: { city_id: string, code: TechnologyCode }): Promise<number> {
    const technology = await this.repository.findOne({ city_id, code })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    return technology.level
  }


  async findOneOrThrow(query: FilterQuery<TechnologyEntity>): Promise<TechnologyEntity> {
    const technology = await this.repository.findOne(query)
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    return technology
  }
}
