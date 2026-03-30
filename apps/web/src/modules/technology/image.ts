import { TechnologyCode } from '@eoneom/api-client'

export const technologyImageSrc = (code: TechnologyCode): string => {
  return `/technologies/${code}.png`
}
