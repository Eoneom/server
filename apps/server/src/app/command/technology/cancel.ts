import { Factory } from '#adapter/factory'
import { TechnologyError } from '#core/technology/error'

export interface CancelTechnologyParams {
  player_id: string
}

export async function cancelTechnology({ player_id }: CancelTechnologyParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:technology:cancel')
  logger.info('run')

  const technology = await repository.technology.getInProgress({ player_id })

  if (!technology) {
    throw new Error(TechnologyError.NOT_IN_PROGRESS)
  }

  await repository.technology.updateOne(technology.cancel())
}
