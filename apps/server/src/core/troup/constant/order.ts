import { TroupCode } from '#core/troup/constant/code'

export const troup_order: Record<TroupCode, number> = {
  [TroupCode.EXPLORER]: 1,
  [TroupCode.SETTLER]: 2,
  [TroupCode.LIGHT_TRANSPORTER]: 3
}
