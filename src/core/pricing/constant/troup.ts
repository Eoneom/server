import { CountCosts } from '#core/pricing/value/count'
import { TroupCode } from '#core/troup/constant'

export const troup_costs: Record<TroupCode, CountCosts> = {
  [TroupCode.EXPLORER]: {
    plastic: 10,
    mushroom: 15,
    duration: 30
  }
}
