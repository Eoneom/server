import { GenericCommand } from '#app/command/generic'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyErrors } from '#core/technology/errors'

interface CancelTechnologyRequest {
  player_id: string
}

interface CancelTechnologyExec {
  technology: TechnologyEntity | null
}

interface CancelTechnologySave {
  technology: TechnologyEntity
}

export class CancelTechnologyCommand extends GenericCommand<
  CancelTechnologyRequest,
  CancelTechnologyExec,
  CancelTechnologySave
> {
  async fetch({ player_id }: CancelTechnologyRequest): Promise<CancelTechnologyExec> {
    const technology = await this.repository.technology.getInProgress({ player_id })

    return { technology }
  }
  exec({ technology }: CancelTechnologyExec): CancelTechnologySave {
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_IN_PROGRESS)
    }

    return { technology: technology.cancel() }
  }
  async save({ technology }: CancelTechnologySave): Promise<void> {
    await this.repository.technology.updateOne(technology)
  }
}
