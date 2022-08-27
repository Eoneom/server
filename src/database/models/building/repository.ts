import { BuildingCreateParams, BuildingRepository } from '../../../core/building/repository'
import { BuildingDocument, BuildingModel, fromBuildingEntity } from './document'

import { BuildingCode } from '../../../core/building/constants'
import { BuildingEntity } from '../../../core/building/entity'

export class MongoBuildingRepository implements BuildingRepository {
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
    const {
      _id,
      code,
      city_id,
      level,
      upgrade_time
    } = building

    return {
      id: _id.toString(),
      code,
      level,
      city_id: city_id.toString(),
      upgrade_time
    }
  }
}
