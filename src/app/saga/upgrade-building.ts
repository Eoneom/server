import { BuildingUpgradeCommand } from '#app/command/building/upgrade'
import { TechnologyFinishResearchCommand } from '#app/command/technology/finish-research'
import { BuildingCode } from '#core/building/constant/code'

export const sagaUpgradeBuilding = async ({
  player_id,
  city_id,
  building_code
}: {
  player_id: string
  city_id: string
  building_code: BuildingCode
}): Promise<void> => {
  await new TechnologyFinishResearchCommand().run({ player_id })
  await new BuildingUpgradeCommand().run({
    player_id,
    city_id,
    building_code
  })
}
