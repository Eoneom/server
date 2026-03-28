import { Factory } from '#adapter/factory'
import { TroupError } from '#core/troup/error'
import { PricingService } from '#core/pricing/service'
import { now } from '#shared/time'

export interface CancelTroupParams {
  city_id: string
  player_id: string
}

export async function cancelTroup({
  city_id,
  player_id,
}: CancelTroupParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:cancel')
  logger.info('run')

  const city_cell = await repository.cell.getCityCell({ city_id })
  const [ city, troup ] = await Promise.all([
    repository.city.get(city_id),
    repository.troup.getInProgress({ cell_id: city_cell.id }),
  ])

  if (!troup) {
    throw new Error(TroupError.NOT_IN_PROGRESS)
  }

  const updated_troup = troup.progressRecruitment({ progress_time: now() })
  const troup_costs = PricingService.getTroupCost({
    code: troup.code,
    count: updated_troup.ongoing_recruitment?.remaining_count ?? 0,
    cloning_factory_level: 0,
    replication_catalyst_level: 0,
  })

  const updated_city = city.refund({
    resource: troup_costs.resource,
    player_id,
  })

  const troup_to_save = updated_troup.cancel()

  await Promise.all([
    repository.troup.updateOne(troup_to_save),
    repository.city.updateOne(updated_city),
  ])
}
