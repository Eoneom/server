import { Factory } from '#adapter/factory'

export interface FinishTechnologyResearchParams {
  player_id: string
}

export async function finishTechnologyResearch({
  player_id,
}: FinishTechnologyResearchParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:technology:finish-research')
  logger.info('run')

  const technology_to_finish = await repository.technology.getResearchDone({ player_id })

  if (!technology_to_finish) {
    return
  }

  await repository.technology.updateOne(technology_to_finish.finishResearch())
}
