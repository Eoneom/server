import { TroupCode } from '#core/troup/constant/code'

interface TroupCharacteristic {
  speed: number
  transport_capacity: number
}

export const troup_characteristics: Record<TroupCode, TroupCharacteristic> = {
  [TroupCode.SETTLER]: {
    speed: 0.75,
    transport_capacity: 1000
  },
  [TroupCode.EXPLORER]: {
    speed: 1.5,
    transport_capacity: 200
  },
  [TroupCode.LIGHT_TRANSPORTER]: {
    speed: 1,
    transport_capacity: 10000
  }
}
