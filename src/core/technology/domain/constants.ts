export enum TechnologyCode {
  BUILDING = 'building'
}

export const technology_required_research_levels: Record<TechnologyCode, number> = {
  [TechnologyCode.BUILDING]: 1
}
