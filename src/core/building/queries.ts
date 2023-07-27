import { BuildingCode } from '#core/building/domain/constants'
import { BuildingEntity } from '#core/building/domain/entity'
import { BuildingErrors } from '#core/building/domain/errors'
import { BuildingService } from '#core/building/domain/service'
import { BuildingRepository } from '#core/building/model'

export class BuildingQueries {
  private repository: BuildingRepository

  public constructor({ repository }: {
    repository: BuildingRepository
  }) {
    this.repository = repository
  }

  async getBuildings({ city_id }: { city_id: string }): Promise<BuildingEntity[]> {
    return this.repository.find({ city_id })
  }
}
