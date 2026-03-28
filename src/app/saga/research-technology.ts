import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { TechnologyResearchCommand } from '#app/command/technology/research'
import { TechnologyCode } from '#core/technology/constant/code'

export const sagaResearchTechnology = async ({
  player_id,
  city_id,
  technology_code
}: {
  player_id: string
  city_id: string
  technology_code: TechnologyCode
}): Promise<void> => {
  await finishBuildingUpgrade({
    player_id,
    city_id
  })
  await new TechnologyResearchCommand().run({
    city_id,
    technology_code,
    player_id
  })
}
