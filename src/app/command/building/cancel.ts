import { Factory } from '#adapter/factory'
import { BuildingError } from '#core/building/error'
import { PricingService } from '#core/pricing/service'

export interface BuildingCancelRequest {
  city_id: string
  player_id: string
}

export async function cancelBuilding({
  city_id,
  player_id,
}: BuildingCancelRequest): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:building:cancel')
  logger.info('run')

  const building = await repository.building.getInProgress({ city_id })

  if (!building) {
    throw new Error(BuildingError.NOT_IN_PROGRESS)
  }

  const city = await repository.city.get(city_id)

  const resource_refund = PricingService.getBuildingUpgradeRefund({
    code: building.code,
    level: building.level
  })

  const updated_city = city.refund({
    player_id,
    resource: resource_refund
  })
  const updated_building = building.cancel()

  await Promise.all([
    repository.building.updateOne(updated_building),
    repository.city.updateOne(updated_city)
  ])
}
