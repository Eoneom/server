import { BuildingFinishUpgradeCommand } from '#app/command/building/finish-upgrade'
import { CityGatherCommand } from '#app/command/city/gather'
import {
  isProductionBuildingCode,
  isWarehouseBuildingCode
} from '#core/building/helper'
import { now } from '#shared/time'

export const sagaGather = async ({
  player_id,
  city_id
}: {
  player_id: string
  city_id: string
}) => {
  const upgrade_result = await new BuildingFinishUpgradeCommand().run({
    player_id,
    city_id
  })

  if (upgrade_result && (isProductionBuildingCode(upgrade_result.code) || isWarehouseBuildingCode(upgrade_result.code))) {
    await new CityGatherCommand().run({
      player_id,
      city_id,
      gather_at_time: upgrade_result.upgraded_at
    })
  }

  await new CityGatherCommand().run({
    player_id,
    city_id,
    gather_at_time: now()
  })
}
