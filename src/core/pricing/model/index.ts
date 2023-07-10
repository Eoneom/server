import { GenericRepository } from '../../../shared/repository'
import { LevelCostEntity } from '../domain/entities/level'
import { UnitCostEntity } from '../domain/entities/unit'

export type LevelCostRepository = GenericRepository<LevelCostEntity>
export type UnitCostRepository = GenericRepository<UnitCostEntity>
