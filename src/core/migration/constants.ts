import { BuildingCode } from '../building/domain/constants'
import { TechnologyCode } from '../technology/domain/constants'

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

export const building_upgrade_durations_in_second: Record<BuildingCode, Record<number, number>> = {
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


export const technology_costs: Record<TechnologyCode, Record<number, { plastic: number, mushroom: number }>> = {
  [TechnologyCode.BUILDING]: {
    1: {
      plastic: 1000,
      mushroom: 2000
    },
    2: {
      plastic: 2000,
      mushroom: 4000
    },
    3: {
      plastic: 4000,
      mushroom: 8000
    },
    4: {
      plastic: 8000,
      mushroom: 16000
    },
  },
}

export const technology_research_durations_in_second: Record<TechnologyCode, Record<number, number>> = {
  [TechnologyCode.BUILDING]: {
    1: 30,
    2: 60,
    3: 120,
    4: 180
  }
}
