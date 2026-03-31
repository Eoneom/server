import { Factory } from '#adapter/factory'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
import { AppEvent } from '#core/events'
import assert from 'assert'

export interface BuildingFinishUpgradeRequest {
  player_id: string
  city_id: string
}

export type BuildingFinishUpgradeResult = {
  code: BuildingCode
  upgraded_at: number
} | null

export async function finishBuildingUpgrade({
  player_id,
  city_id,
}: BuildingFinishUpgradeRequest): Promise<BuildingFinishUpgradeResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:building:finish-upgrade')
  logger.info('run')

  const city = await repository.city.get(city_id)

  if (!city.isOwnedBy(player_id)) {
    throw new Error(CityError.NOT_OWNER)
  }

  const building_to_finish = await repository.building.getUpgradeDone({ city_id })

  if (!building_to_finish) {
    return null
  }

  assert(building_to_finish.upgrade_at)

  const upgraded_at = building_to_finish.upgrade_at
  const building = building_to_finish.finishUpgrade()

  await repository.building.updateOne(building)

  Factory.getEventBus().emit(AppEvent.BuildingUpgradeFinished, { city_id, player_id })

  return {
    code: building.code,
    upgraded_at
  }
}
