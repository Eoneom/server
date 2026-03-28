import { TroopCode } from '#core/troop/constant/code'

export const troop_order: Record<TroopCode, number> = {
  [TroopCode.EXPLORER]: 1,
  [TroopCode.SETTLER]: 2,
  [TroopCode.LIGHT_TRANSPORTER]: 3
}
