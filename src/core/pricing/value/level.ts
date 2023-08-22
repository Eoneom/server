import { Resource } from '#shared/resource'

export interface LevelCostValue {
  code: string
  level: number
  resource: Resource
  duration: number
}
