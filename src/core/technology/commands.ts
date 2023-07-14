import { Factory } from '../factory'
import { TechnologyCode } from './domain/constants'
import { TechnologyErrors } from './domain/errors'
import { TechnologyEventCode } from './domain/events'
import { TechnologyRepository } from './model'
import { TechnologyService } from './domain/service'
import { now } from '../../shared/time'

interface TechnologyLaunchResearchCommand {
  code: TechnologyCode
  player_id: string
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

  async init({ player_id }: TechnologyInitCommand): Promise<void> {
    const has_technologies = await this.repository.exists({ player_id })

    const technologies = this.service.initTechnologies({
      player_id,
      has_technologies
    })

    await Promise.all(technologies.map((technology) => this.repository.create(technology)))
  }

  async requestResearch({ code, city_id, player_id }: { code: TechnologyCode, city_id: string, player_id: string }): Promise<void> {
    const is_technology_in_progress = await this.repository.exists({
      player_id,
      researched_at: {
        $exists: true,
        $ne: null
      }
    })

    if (is_technology_in_progress) {
      throw new Error(TechnologyErrors.ALREADY_IN_PROGRESS)
    }

    const technology = await this.repository.findOne({ code, city_id })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    Factory.getEventBus().emit(TechnologyEventCode.RESEARCH_REQUESTED, {
      city_id,
      code,
      current_level: technology.level
    })
  }

  async launchResearch({ code, player_id, duration, research_lab_level }: TechnologyLaunchResearchCommand): Promise<void> {
    const technology = await this.repository.findOne({ code, player_id })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    const result = this.service.launchResearch({
      research_level: research_lab_level,
      technology,
      duration
    })

    await this.repository.updateOne(result.technology)
    Factory.getEventBus().emit(TechnologyEventCode.RESEARCH_LAUNCHED, { code })
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
