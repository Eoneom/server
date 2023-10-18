import { GenericCommand } from '#command/generic'
import { TechnologyEntity } from '#core/technology/entity'

export interface TechnologyFinishResearchRequest {
  player_id: string
}

interface TechnologyFinishResearchExec {
  technology_to_finish: TechnologyEntity | null
}

interface TechnologyFinishResearchSave {
  technology: TechnologyEntity | null
}

export class TechnologyFinishResearchCommand extends GenericCommand<
  TechnologyFinishResearchRequest,
  TechnologyFinishResearchExec,
  TechnologyFinishResearchSave
> {
  constructor() {
    super({ name: 'technology:finish-research' })
  }

  async fetch({ player_id }: TechnologyFinishResearchRequest): Promise<TechnologyFinishResearchExec> {
    const technology_to_finish = await this.repository.technology.getResearchDone({ player_id })

    return { technology_to_finish }
  }

  exec({ technology_to_finish }: TechnologyFinishResearchExec): TechnologyFinishResearchSave {
    if (!technology_to_finish) {
      return { technology: null }
    }

    return { technology: technology_to_finish.finishResearch() }
  }

  async save({ technology }: TechnologyFinishResearchSave) {
    if (!technology) {
      return
    }

    await this.repository.technology.updateOne(technology)
  }
}
