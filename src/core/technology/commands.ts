import { TechnologyRepository } from '#core/technology/model'
import { now } from '#shared/time'

interface TechnologyFinishResearchesCommand {
  player_id: string
}

export class TechnologyCommands {
  private repository: TechnologyRepository

  constructor({ repository }: {
    repository: TechnologyRepository
  }) {
    this.repository = repository
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
