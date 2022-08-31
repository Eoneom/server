import { LevelCostRepository, UnitCostRepository } from './repository'

import { LevelCostEntity } from './domain/entities/level'
import { PricingErrors } from './domain/entities/errors'
import { Repository } from '../shared/repository'
import { UnitCostEntity } from './domain/entities/unit'

export class PricingQueries {
  private level_repository: LevelCostRepository
  private unit_repository: UnitCostRepository

  constructor({
    level_repository,
    unit_repository,
  }: {
    level_repository: LevelCostRepository,
    unit_repository: UnitCostRepository,
  }) {
    this.level_repository = level_repository
    this.unit_repository = unit_repository
  }

  async getLevelCost({ level, code }: { level: number, code: string }): Promise<LevelCostEntity> {
    const level_cost = await this.level_repository.findOne({ code, level })
    if (!level_cost) {
      throw new Error(PricingErrors.LEVEL_COST_NOT_FOUND)
    }

    return level_cost
  }

  async getUnitCost(code: string): Promise<UnitCostEntity> {
    const unit_cost = await this.unit_repository.findOne({ code })
    if (!unit_cost) {
      throw new Error(PricingErrors.UNIT_COST_NOT_FOUND)
    }

    return unit_cost
  }
}
