import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { cityGather } from '#app/command/city/gather'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'
import {
  isProductionBuildingCode,
  isWarehouseBuildingCode
} from '#core/building/helper'
import { now } from '#shared/time'
import { sagaFinishMovement } from '../finish/movement'

export const sagaRefreshGameState = async ({
  player_id,
  city_id
}: {
  player_id: string
  city_id: string
}) => {
  await finishTechnologyResearch({ player_id })

  await sagaFinishMovement({ player_id })

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
