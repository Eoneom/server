import { technology_costs, technology_required_research_levels, technology_research_durations_in_second } from './constants'

import { TechnologyEntity } from './entity'
import { TechnologyErrors } from './errors'

export class TechnologyService {
  initTechnologies({
    player_id,
    has_technologies
  }: {
    player_id: string,
    has_technologies: boolean
  }): TechnologyEntity[] {
    if (has_technologies) {
      throw new Error(TechnologyErrors.ALREADY_EXISTS)
    }

    const building = TechnologyEntity.initBuilding({ player_id })

    return [
      building
    ]
  }

  launchResearch({
    is_technology_in_progress,
    has_enough_resources,
    research_level,
    technology
  }: {
    is_technology_in_progress: boolean,
    has_enough_resources: boolean,
    research_level: number,
    technology: TechnologyEntity
  }): {
    technology: TechnologyEntity
  } {
    if (is_technology_in_progress) {
      throw new Error(TechnologyErrors.ALREADY_IN_PROGRESS)
    }

    if (!has_enough_resources) {
      throw new Error(TechnologyErrors.NOT_ENOUGH_RESOURCES)
    }

    const has_required_research_level = this.hasRequiredResearchLevel({ research_level, technology })
    if (!has_required_research_level) {
      throw new Error(TechnologyErrors.NOT_REQUIRED_RESEARCH_LEVEL)
    }

    const research_duration = this.getResearchDurationInSeconds(technology)
    return {
      technology: technology.launchResearch(research_duration)
    }
  }

  getCostsForResearch({ code, level }: TechnologyEntity): { plastic: number, mushroom: number } {
    const costs = technology_costs[code]
    if (!costs) {
      throw new Error(TechnologyErrors.UNKNOWN_TECHNOLOGY)
    }
    const upgraded_level = level + 1
    const level_costs = costs[upgraded_level]
    if (!level_costs) {
      throw new Error(TechnologyErrors.UNKNOWN_COSTS_LEVEL)
    }

    return level_costs
  }

  private hasRequiredResearchLevel({ research_level, technology }: { research_level: number, technology: TechnologyEntity }): boolean {
    return research_level >= technology_required_research_levels[technology.code]
  }

  private getResearchDurationInSeconds({ code, level }: TechnologyEntity): number {
    const research_durations = technology_research_durations_in_second[code]
    if (!research_durations) {
      throw new Error(TechnologyErrors.UNKNOWN_TECHNOLOGY)
    }

    const upgraded_level = level + 1
    const research_duration = research_durations[upgraded_level]
    if (!research_duration) {
      throw new Error(TechnologyErrors.UNKNOWN_RESEARCH_DURATION_LEVEL)
    }

    return research_duration
  }
}
