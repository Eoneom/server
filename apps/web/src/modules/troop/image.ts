import { TroopCode } from '@eoneom/api-client'

export const troopImageSrc = (code: TroopCode): string => {
  return `/troops/${code}.png`
}
