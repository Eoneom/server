import { BuildingCode } from '#core/building/domain/constants'
import { LevelCostEntity } from '#core/pricing/domain/entities/level'
import { TechnologyCode } from '#core/technology/domain/constants'
import { GenericRepository } from '#shared/repository'

export interface LevelCostRepository extends GenericRepository<LevelCostEntity> {
  getNextLevelCost: (query: { level: number, code: TechnologyCode | BuildingCode }) => Promise<LevelCostEntity>
}
