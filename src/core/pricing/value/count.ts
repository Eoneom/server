import { TroupCode } from '#core/troup/constant'
import { Resource } from '#shared/resource'

export interface CountCosts {
  plastic: number
  mushroom: number
  duration: number
}

export interface CountCostValue {
  code: TroupCode
  resource: Resource
  duration: number
}
