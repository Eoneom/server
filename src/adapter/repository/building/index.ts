import { BuildingEntity } from '#core/building/entity'
import { BuildingRepository } from '#app/port/repository/building'
import {
  BuildingDocument, BuildingModel
} from '#adapter/repository/building/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingError } from '#core/building/error'
import { now } from '#shared/time'
import {
  ProductionBuildingCode,
  ProductionBuildingLevels, production_building_codes
} from '#modules/resource/constant/production'
import {
  WarehouseBuildingCode, WarehouseBuildingLevels
} from '#modules/resource/constant/warehouse-capacity'
import assert from 'assert'

export class MongoBuildingRepository
  extends MongoGenericRepository<typeof BuildingModel, BuildingDocument, BuildingEntity>
  implements BuildingRepository {

  constructor() {
    super(BuildingModel, BuildingError.NOT_FOUND)
  }

  async getWarehouseLevels(): Promise<WarehouseBuildingLevels> {
    const buildings = await this.model.find<{ code: WarehouseBuildingCode, level: number }>({ code: production_building_codes }, {
      code: 1,
      level: 1
    })

    const plastic_warehouse = buildings.find(building => building.code === BuildingCode.PLASTIC_WAREHOUSE)
    assert(plastic_warehouse)

    const mushroom_warehouse = buildings.find(building => building.code === BuildingCode.MUSHROOM_WAREHOUSE)
    assert(mushroom_warehouse)

    return {
      plastic_warehouse: plastic_warehouse.level,
      mushroom_warehouse: mushroom_warehouse.level
    }
  }

  async getProductionLevels(): Promise<ProductionBuildingLevels> {
    const buildings = await this.model.find<{ code: ProductionBuildingCode, level: number }>({ code: production_building_codes }, {
      code: 1,
      level: 1
    })

    const recycling_plant = buildings.find(building => building.code === BuildingCode.RECYCLING_PLANT)
    assert(recycling_plant)

    const mushroom_farm = buildings.find(building => building.code === BuildingCode.MUSHROOM_FARM)
    assert(mushroom_farm)

    return {
      recycling_plant: recycling_plant.level,
      mushroom_farm: mushroom_farm.level
    }
  }

  async getTotalLevels({ city_id }: { city_id: string }): Promise<number> {
    const buildings = await this.model.find({ city_id }, { level: 1 })
    return buildings.reduce((acc, building) => acc + building.level, 0)
  }

  async list({
    city_id, codes
  }: { city_id: string, codes?: BuildingCode[] }): Promise<BuildingEntity[]> {
    if (codes) {
      return this.find({
        city_id,
        code: { $in: codes }
      })
    }

    return this.find({ city_id })
  }

  async get(query: { city_id: string; code: BuildingCode }): Promise<BuildingEntity> {
    return this.findOneOrThrow(query)
  }

  async isInProgress({ city_id }: { city_id: string }): Promise<boolean> {
    return this.exists({
      city_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })
  }

  async getInCity({
    city_id, code
  }: { city_id: string, code: BuildingCode }): Promise<BuildingEntity> {
    const building = await this.model.findOne({
      city_id,
      code
    })
    if (!building) {
      throw new Error(BuildingError.NOT_FOUND)
    }

    return this.buildFromModel(building)
  }

  async getLevel({
    city_id,
    code
  }: { city_id: string; code: BuildingCode }): Promise<number> {
    const building = await this.model.findOne<{ level: number }>({
      city_id,
      code
    }, { level: 1 })
    if (!building) {
      throw new Error(BuildingError.NOT_FOUND)
    }

    return building.level
  }

  async getUpgradeDone({ city_id }: { city_id: string }): Promise<BuildingEntity | null> {
    return this.findOne({
      city_id,
      upgrade_at: { $lte: now() }
    })
  }

  async getInProgress({ city_id }: { city_id: string }): Promise<BuildingEntity | null> {
    return this.findOne({
      city_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })
  }

  protected buildFromModel(document: BuildingDocument): BuildingEntity {
    return BuildingEntity.create({
      id: document._id.toString(),
      code: document.code,
      level: document.level,
      city_id: document.city_id.toString(),
      upgrade_at: document.upgrade_at
    })
  }
}
