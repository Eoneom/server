import { CountCosts } from '#core/pricing/value/count'
import { TroupCode } from '#core/troup/constant/code'

export const CLONING_FACTORY_REDUCTION_PER_LEVEL = 10
export const REPLICATION_CATALYST_REDUCTION_PER_LEVEL = 10

export const troup_costs: Record<TroupCode, CountCosts> = {
  [TroupCode.EXPLORER]: {
    plastic: 10,
    mushroom: 15,
    duration: 60
  },
  [TroupCode.SETTLER]: {
    plastic: 20000,
    mushroom: 40000,
    duration: 3600
  },
  [TroupCode.LIGHT_TRANSPORTER]: {
    plastic: 3000,
    mushroom: 2000,
    duration: 240
  }
}
