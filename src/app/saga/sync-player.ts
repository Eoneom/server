import { Factory } from '#adapter/factory'
import { TechnologyFinishResearchCommand } from '#app/command/technology/finish-research'
import { sagaGather } from '#app/saga/gather'

const logger = Factory.getLogger('saga:sync-player')

export const sagaSyncPlayer = async ({ player_id }: { player_id: string }) => {
  const repository = Factory.getRepository()
  logger.info(player_id)

  await new TechnologyFinishResearchCommand().run({ player_id })

  const cities = await repository.city.list({ player_id })
  await Promise.all(cities.map(async city => {
    await sagaGather({
      player_id,
      city_id: city.id
    })
  }))
}
