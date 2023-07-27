import { TechnologyEntity } from '#core/technology/domain/entity'
import { TechnologyService } from '#core/technology/domain/service'
import { TechnologyRepository } from '#core/technology/model'
import { now } from '#shared/time'

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

  async finishResearch({ player_id }: TechnologyFinishResearchesCommand): Promise<void> {
    const technology_to_finish = await this.repository.findOne({
      player_id,
      research_at: { $lte: now() }
    })
    if (!technology_to_finish) {
      return
    }

    const finished_technology = technology_to_finish.finishResearch()
    await this.repository.updateOne(finished_technology)
  }
}
