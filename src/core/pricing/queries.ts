import { LevelCostRepository } from '#app/repository/pricing'
import { UnitCostEntity } from '#core/pricing/domain/entities/unit'
import { PricingErrors } from '#core/pricing/domain/errors'
import { UnitCostRepository } from '#core/pricing/model'

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

  async doesLevelCostsExists(): Promise<boolean> {
    return this.level_repository.exists({})
  }

  async getUnitCost(code: string): Promise<UnitCostEntity> {
    const unit_cost = await this.unit_repository.findOne({ code })
    if (!unit_cost) {
      throw new Error(PricingErrors.UNIT_COST_NOT_FOUND)
    }

    return unit_cost
  }
}
