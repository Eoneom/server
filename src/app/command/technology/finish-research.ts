import { GenericCommand } from '#command/generic'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyError } from '#core/technology/error'

export interface TechnologyFinishResearchRequest {
  player_id: string
}

interface TechnologyFinishResearchExec {
  technology_to_finish: TechnologyEntity | null
}

interface TechnologyFinishResearchSave {
  technology: TechnologyEntity
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
      throw new Error(TechnologyError.NOT_IN_PROGRESS)
    }

    return { technology: technology_to_finish.finishResearch() }
  }

  async save({ technology }: TechnologyFinishResearchSave) {
    await this.repository.technology.updateOne(technology)
  }
}
