import { TechnologyEntity } from './entity'
import { TechnologyErrors } from './errors'
import { technology_required_research_levels } from './constants'

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
    technology,
    duration
  }: {
    is_technology_in_progress: boolean
    has_enough_resources: boolean
    research_level: number
    technology: TechnologyEntity
    duration: number
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

    return {
      technology: technology.launchResearch(duration)
    }
  }

  private hasRequiredResearchLevel({ research_level, technology }: { research_level: number, technology: TechnologyEntity }): boolean {
    return research_level >= technology_required_research_levels[technology.code]
  }
}
