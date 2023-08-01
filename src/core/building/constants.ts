export enum BuildingCode {
  RECYCLING_PLANT = 'recycling_plant',
  MUSHROOM_FARM = 'mushroom_farm',
  RESEARCH_LAB = 'research_lab'
}

export interface Earnings {
  base: number
  multiplier: number
}

export const building_earnings: Record<BuildingCode.RECYCLING_PLANT | BuildingCode.MUSHROOM_FARM, Earnings> = {
  [BuildingCode.RECYCLING_PLANT]: {
    base: 2,
    multiplier: 1.3
  },
  [BuildingCode.MUSHROOM_FARM]: {
    base: 5,
    multiplier: 1.5
  }
}
