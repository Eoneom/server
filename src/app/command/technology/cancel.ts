import { GenericCommand } from '#command/generic'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyErrors } from '#core/technology/errors'

interface TechnologyCancelRequest {
  player_id: string
}

interface TechnologyCancelExec {
  technology: TechnologyEntity | null
}

interface TechnologyCancelSave {
  technology: TechnologyEntity
}

export class TechnologyCancelCommand extends GenericCommand<
  TechnologyCancelRequest,
  TechnologyCancelExec,
  TechnologyCancelSave
> {
  async fetch({ player_id }: TechnologyCancelRequest): Promise<TechnologyCancelExec> {
    const technology = await this.repository.technology.getInProgress({ player_id })

    return { technology }
  }
  exec({ technology }: TechnologyCancelExec): TechnologyCancelSave {
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_IN_PROGRESS)
    }

    return { technology: technology.cancel() }
  }
  async save({ technology }: TechnologyCancelSave): Promise<void> {
    await this.repository.technology.updateOne(technology)
  }
}
