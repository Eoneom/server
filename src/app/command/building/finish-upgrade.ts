import { Factory } from '#adapter/factory'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
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

  const [
    city,
    building_to_finish
  ] = await Promise.all([
    repository.city.get(city_id),
    repository.building.getUpgradeDone({ city_id })
  ])

  if (!city.isOwnedBy(player_id)) {
    throw new Error(CityError.NOT_OWNER)
  }

  if (!building_to_finish) {
    return null
  }

  assert(building_to_finish.upgrade_at)

  const upgraded_at = building_to_finish.upgrade_at
  const building = building_to_finish.finishUpgrade()

  await repository.building.updateOne(building)

  return {
    code: building.code,
    upgraded_at
  }
}
