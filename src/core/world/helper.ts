import {
  REGION_SIZE,
  SECTOR_SIZE
} from '#core/world/constant/size'

export const normalizeCoordinate = (random_coordinate: number): number => {
  return Math.floor(random_coordinate * SECTOR_SIZE) + 1
}

export const normalizeSector = (random_sector: number): number => {
  return Math.floor(random_sector * REGION_SIZE * REGION_SIZE) + 1
}
