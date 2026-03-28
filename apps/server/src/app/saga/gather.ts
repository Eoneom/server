import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { cityGather } from '#app/command/city/gather'
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
  const upgrade_result = await finishBuildingUpgrade({
    player_id,
    city_id
  })

  if (upgrade_result && (isProductionBuildingCode(upgrade_result.code) || isWarehouseBuildingCode(upgrade_result.code))) {
    await cityGather({
      player_id,
      city_id,
      gather_at_time: upgrade_result.upgraded_at
    })
  }

  await cityGather({
    player_id,
    city_id,
    gather_at_time: now()
  })
}
