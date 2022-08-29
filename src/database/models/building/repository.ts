import { BuildingCreateParams, BuildingFindOneParams, BuildingRepository } from '../../../core/ports/repository/building'
import { BuildingDocument, BuildingModel, fromBuildingEntity } from './document'

import { BuildingCode } from '../../../core/building/constants'
import { BuildingEntity } from '../../../core/building/entity'

export class MongoBuildingRepository implements BuildingRepository {
  findOne(query: BuildingFindOneParams): Promise<BuildingEntity | null> {
    throw new Error('Method not implemented.')
  }
  async findByCode(code: string): Promise<BuildingEntity | null> {
    const building = await BuildingModel.findOne({ code })
    if (!building) {
      return null
    }

    return this.buildFromModel(building)
  }

  async save(building: BuildingEntity): Promise<void> {
    await BuildingModel.updateOne({ _id: building.id }, fromBuildingEntity(building))
  }

  async getInProgress(query: { city_id: string }): Promise<BuildingEntity | null> {
    const building = await BuildingModel.findOne({ city_id: query.city_id, upgrade_time: { $exists: true } })
    if (!building) {
      return null
    }

    return this.buildFromModel(building)
  }

  async level(query: { code: BuildingCode; city_id: string }): Promise<number | null> {
    const building = await BuildingModel.findOne(query, { level: 1 })
    if (!building) {
      return null
    }

    return building.level
  }

  async exists(query: { code: BuildingCode; city_id: string }): Promise<boolean> {
    const existing = await BuildingModel.exists(query)
    return Boolean(existing)
  }

  async create(params: BuildingCreateParams): Promise<string> {
    const building = await BuildingModel.create(params)
    return building._id.toString()
  }

  private buildFromModel(building: BuildingDocument): BuildingEntity {
    return new BuildingEntity({
      id: building._id.toString(),
      code: building.code,
      level: building.level,
      city_id: building.city_id.toString(),
      upgrade_time: building.upgrade_time
    })
  }
}
