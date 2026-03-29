import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
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

  const [
    city,
    city_cell
  ] = await Promise.all([
    repository.city.get(city_id),
    repository.cell.getCityCell({ city_id })
  ])

  const resource_refund = PricingService.getBuildingUpgradeRefund({
    code: building.code,
    level: building.level
  })

  const stock = await repository.resource_stock.getByCellId({
    cell_id: city_cell.id
  })
  AppService.assertCityResourceStockContext({ city, city_cell, stock, player_id })
  const updated_stock = stock.refund({ resource: resource_refund })
  const updated_building = building.cancel()

  await Promise.all([
    repository.building.updateOne(updated_building),
    repository.resource_stock.updateOne(updated_stock)
  ])
}
