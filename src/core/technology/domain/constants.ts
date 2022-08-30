export enum TechnologyCode {
  BUILDING = 'building'
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

export const technology_required_research_levels: Record<TechnologyCode, number> = {
  [TechnologyCode.BUILDING]: 1
}
