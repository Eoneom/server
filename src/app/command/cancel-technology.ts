import { GenericCommand } from '#app/command/generic'
import { Factory } from '#app/factory'
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
    const repository = Factory.getRepository()
    const technology = await repository.technology.findOne({
      player_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })

    return { technology }
  }
  exec({ technology }: CancelTechnologyExec): CancelTechnologySave {
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_IN_PROGRESS)
    }

    return { technology: technology.cancel() }
  }
  async save({ technology }: CancelTechnologySave): Promise<void> {
    const repository = Factory.getRepository()
    await repository.technology.updateOne(technology)
  }
}
