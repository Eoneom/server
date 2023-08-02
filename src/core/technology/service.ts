import { technology_required_research_levels } from '#core/technology/constants'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyErrors } from '#core/technology/errors'

export class TechnologyService {
  static init({ player_id }: { player_id: string }): TechnologyEntity[] {
    const architecture = TechnologyEntity.initArchitecture({ player_id })

    return [ architecture ]
  }

  static launchResearch({
    is_technology_in_progress,
    research_lab_level,
    technology,
    duration
  }: {
    research_lab_level: number
    technology: TechnologyEntity
    duration: number
    is_technology_in_progress: boolean
  }): TechnologyEntity {
    if (is_technology_in_progress) {
      throw new Error(TechnologyErrors.ALREADY_IN_PROGRESS)
    }

    const has_required_research_level = this.hasRequiredResearchLevel({
      research_lab_level,
      technology
    })
    if (!has_required_research_level) {
      throw new Error(TechnologyErrors.NOT_REQUIRED_RESEARCH_LEVEL)
    }

    return technology.launchResearch(duration)
  }

  private static hasRequiredResearchLevel({
    research_lab_level, technology
  }: { research_lab_level: number, technology: TechnologyEntity }): boolean {
    return research_lab_level >= technology_required_research_levels[technology.code]
  }
}
