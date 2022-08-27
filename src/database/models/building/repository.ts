import { BuildingCreateParams, BuildingRepository } from '../../../core/building/repository'

import { BuildingCode } from '../../../core/building/constants'
import { BuildingModel } from './document'

export class MongoBuildingRepository implements BuildingRepository {
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
}
