import { LevelCostRepository, UnitCostRepository } from './model'

import { Resource } from '../../shared/resource'

interface PricingCreateLevelCommand {
  code: string
  level: number
  resource: Resource
  duration: number
}

interface PricingCreateUnitCommand {
  code: string
  resource: Resource
  duration: number
}


export class PricingCommands {
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

  async createLevelCost(props: PricingCreateLevelCommand): Promise<string> {
    return this.level_repository.create(props)
  }

  async createUnitCost(props: PricingCreateUnitCommand): Promise<string> {
    return this.unit_repository.create(props)
  }

  async createBulkLevelCost(props: PricingCreateLevelCommand[]): Promise<string[]> {
    const promises = props.map(prop => this.level_repository.create(prop))
    return Promise.all(promises)
  }
}
