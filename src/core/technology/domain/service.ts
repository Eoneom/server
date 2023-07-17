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
    research_lab_level,
    technology,
    duration
  }: {
    research_lab_level: number
    technology: TechnologyEntity
    duration: number
  }): {
    technology: TechnologyEntity
  } {
    const has_required_research_level = this.hasRequiredResearchLevel({ research_lab_level, technology })
    if (!has_required_research_level) {
      throw new Error(TechnologyErrors.NOT_REQUIRED_RESEARCH_LEVEL)
    }

    return {
      technology: technology.launchResearch(duration)
    }
  }

  private hasRequiredResearchLevel({ research_lab_level, technology }: { research_lab_level: number, technology: TechnologyEntity }): boolean {
    return research_lab_level >= technology_required_research_levels[technology.code]
  }
}
