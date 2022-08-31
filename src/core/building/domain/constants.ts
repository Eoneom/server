export enum BuildingCode {
  RECYCLING_PLANT = 'recycling_plant',
  MUSHROOM_FARM = 'mushroom_farm',
  RESEARCH_LAB = 'research_lab'
}

export const building_earnings: Record<BuildingCode.RECYCLING_PLANT | BuildingCode.MUSHROOM_FARM, Record<number, number>> = {
  [BuildingCode.RECYCLING_PLANT]: {
    1: 2,
    2: 10,
    3: 15,
    4: 30
  },
  [BuildingCode.MUSHROOM_FARM]: {
    1: 25,
    2: 35,
    3: 60,
    4: 100
  }
}
