export enum BuildingCode {
  RECYCLING_PLANT = 'recycling_plant',
  MUSHROOM_FARM = 'mushroom_farm',
  RESEARCH_LAB = 'research_lab'
}

export const building_costs: Record<BuildingCode, Record<number, { plastic: number, mushroom: number }>> = {
  [BuildingCode.RECYCLING_PLANT]: {
    2: {
      plastic: 200,
      mushroom: 100
    },
    3: {
      plastic: 500,
      mushroom: 250
    },
    4: {
      plastic: 1000,
      mushroom: 500
    },
  },
  [BuildingCode.MUSHROOM_FARM]: {
    2: {
      plastic: 100,
      mushroom: 200
    },
    3: {
      plastic: 400,
      mushroom: 800
    },
    4: {
      plastic: 800,
      mushroom: 1600
    }
  },
  [BuildingCode.RESEARCH_LAB]: {
    1: {
      plastic: 500,
      mushroom: 500
    },
    2: {
      plastic: 1500,
      mushroom: 2500
    },
    3: {
      plastic: 3000,
      mushroom: 6000
    },
    4: {
      plastic: 6000,
      mushroom: 15000
    }
  }
}

export const building_upgrade_times_in_second: Record<BuildingCode, Record<number, number>> = {
  [BuildingCode.RECYCLING_PLANT]: {
    2: 5,
    3: 10,
    4: 15,
  },
  [BuildingCode.MUSHROOM_FARM]: {
    2: 60,
    3: 120,
    4: 180,
  },
  [BuildingCode.RESEARCH_LAB]: {
    1: 10,
    2: 60,
    3: 145,
    4: 180
  }
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
