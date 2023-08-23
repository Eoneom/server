import { BuildingCode } from '#core/building/constant'
import { TechnologyCode } from '#core/technology/constant'
import { Resource } from '#shared/resource'

export interface LevelCost {
  base: number
  multiplier: number
}

export interface LevelCosts {
  plastic: LevelCost
  mushroom: LevelCost
  duration: LevelCost
}

export interface LevelCostValue {
  code: BuildingCode | TechnologyCode
  level: number
  resource: Resource
  duration: number
}
