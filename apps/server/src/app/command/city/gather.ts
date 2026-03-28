import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { CityError } from '#core/city/error'

export interface CityGatherRequest {
  city_id: string
  player_id: string
  gather_at_time: number
}

export async function cityGather({
  city_id,
  player_id,
  gather_at_time,
}: CityGatherRequest): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:city:gather')
  logger.info('run')

  const city = await repository.city.get(city_id)

  if (!city.isOwnedBy(player_id)) {
    throw new Error(CityError.NOT_OWNER)
  }

  const [
    earnings_per_second,
    warehouses_capacity
  ] = await Promise.all([
    AppService.getCityEarningsBySecond({ city_id }),
    AppService.getCityWarehousesCapacity({ city_id })
  ])

  const {
    city: updated_city,
    updated
  } = city.gather({
    player_id,
    gather_at_time,
    earnings_per_second,
    warehouses_capacity
  })

  if (!updated) {
    return
  }

  await repository.city.updateOne(updated_city)
}
