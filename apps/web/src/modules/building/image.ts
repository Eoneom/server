import { BuildingCode } from '@eoneom/api-client'

export const buildingImageSrc = (code: BuildingCode): string => {
  return `/buildings/${code}.png`
}
