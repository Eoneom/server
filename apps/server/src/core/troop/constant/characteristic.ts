import { TroopCode } from '#core/troop/constant/code'

interface TroopCharacteristic {
  speed: number
  transport_capacity: number
}

export const troop_characteristics: Record<TroopCode, TroopCharacteristic> = {
  [TroopCode.SETTLER]: {
    speed: 0.75,
    transport_capacity: 1000
  },
  [TroopCode.EXPLORER]: {
    speed: 1.5,
    transport_capacity: 200
  },
  [TroopCode.LIGHT_TRANSPORTER]: {
    speed: 1,
    transport_capacity: 10000
  },
  [TroopCode.FARMER]: {
    speed: 1,
    transport_capacity: 200
  },
  [TroopCode.RECYCLER]: {
    speed: 1,
    transport_capacity: 200
  }
}
