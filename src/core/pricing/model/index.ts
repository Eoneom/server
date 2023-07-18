import { LevelCostEntity } from '#core/pricing/domain/entities/level'
import { UnitCostEntity } from '#core/pricing/domain/entities/unit'
import { GenericRepository } from '#shared/repository'

export type LevelCostRepository = GenericRepository<LevelCostEntity>
export type UnitCostRepository = GenericRepository<UnitCostEntity>
