import { BuildingCode } from '#core/building/domain/constants'
import { BuildingEntity } from '#core/building/domain/entity'
import { BuildingErrors } from '#core/building/domain/errors'
import { BuildingService } from '#core/building/domain/service'
import { BuildingRepository } from '#core/building/model'
import { Resource } from '#shared/resource'
import { FilterQuery } from '#type/database'

export class BuildingQueries {
  private repository: BuildingRepository
  private service: BuildingService

  public constructor({
    repository,
    service,
  }: {
    repository: BuildingRepository
    service: BuildingService
  }) {
    this.repository = repository
    this.service = service
  }

  async getBuildings({ city_id }: { city_id: string }): Promise<BuildingEntity[]> {
    return this.repository.find({ city_id })
  }

  async findOneOrThrow(query: FilterQuery<BuildingEntity>): Promise<BuildingEntity> {
    const building = await this.repository.findOne(query)
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return building
  }

  async getEarningsBySecond({ city_id }: { city_id: string }): Promise<Resource> {
    const [
      recycling_plant,
      mushroom_farm,
    ] = await Promise.all([
      this.repository.findOne({
        code: BuildingCode.RECYCLING_PLANT,
        city_id 
      }),
      this.repository.findOne({
        code: BuildingCode.MUSHROOM_FARM,
        city_id 
      }),
    ])
    if (!mushroom_farm || !recycling_plant) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return this.service.getEarningsBySecond({
      recycling_plant_level: recycling_plant.level,
      mushroom_farm_level: mushroom_farm.level
    })
  }

  async getResearchLevel({ city_id }: { city_id: string }): Promise<number> {
    const research_lab = await this.repository.findOne({
      city_id,
      code: BuildingCode.RESEARCH_LAB 
    })
    if (!research_lab) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return research_lab.level
  }
}
