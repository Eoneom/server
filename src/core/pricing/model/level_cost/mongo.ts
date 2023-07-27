import { LevelCostRepository } from '#app/repository/pricing'
import { BuildingCode } from '#core/building/domain/constants'
import { LevelCostEntity } from '#core/pricing/domain/entities/level'
import {
  LevelCostDocument, LevelCostModel
} from '#core/pricing/model/level_cost/document'
import { TechnologyCode } from '#core/technology/domain/constants'
import { MongoGenericRepository } from '#database/generic'

export class MongoLevelCostRepository
  extends MongoGenericRepository<typeof LevelCostModel, LevelCostDocument, LevelCostEntity>
  implements LevelCostRepository {

  async getNextLevelCost ({
    level,
    code
  }: {
    level: number
    code: BuildingCode | TechnologyCode
  }): Promise<LevelCostEntity> {
    return this.findOneOrThrow({
      level: level + 1,
      code
    })
  }

  protected buildFromModel(document: LevelCostDocument): LevelCostEntity {
    return LevelCostEntity.create({
      id: document._id.toString(),
      code: document.code,
      level: document.level,
      resource: document.resource,
      duration: document.duration
    })
  }
}
