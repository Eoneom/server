import { TechnologyErrors } from './domain/errors'
import { TechnologyRepository } from './model'
import { TechnologyService } from './domain/service'
import { now } from '../../shared/time'
import { TechnologyEntity } from './domain/entity'

interface TechnologyLaunchResearchCommand {
  player_id: string
  technology: TechnologyEntity
  duration: number
  research_lab_level: number
}

interface TechnologyInitCommand {
  player_id: string
}

interface TechnologyFinishResearchesCommand {
  player_id: string
}

export class TechnologyCommands {
  private repository: TechnologyRepository
  private service: TechnologyService

  constructor({
    repository,
    service,
  }: {
    repository: TechnologyRepository
    service: TechnologyService
  }) {
    this.repository = repository
    this.service = service
  }

  async init({ player_id }: TechnologyInitCommand): Promise<TechnologyEntity[]> {
    const has_technologies = await this.repository.exists({ player_id })

    return this.service.initTechnologies({
      player_id,
      has_technologies
    })
  }

  async launchResearch({
    technology,
    duration,
    player_id,
    research_lab_level
  }: TechnologyLaunchResearchCommand): Promise<TechnologyEntity> {
    const technology_in_progress = await this.repository.exists({
      player_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })

    if (technology_in_progress) {
      throw new Error(TechnologyErrors.ALREADY_IN_PROGRESS)
    }

    const { technology: updated_technology } = this.service.launchResearch({
      research_lab_level,
      technology,
      duration
    })

    return updated_technology
  }

  async finishResearch({ player_id }: TechnologyFinishResearchesCommand): Promise<void> {
    const technology_to_finish = await this.repository.findOne({
      player_id,
      researched_at: {
        $lte: now()
      }
    })
    if (!technology_to_finish) {
      return
    }

    const finished_technology = technology_to_finish.finishResearch()
    await this.repository.updateOne(finished_technology)
  }
}
