import { Factory } from '#adapter/factory'
import { TroopError } from '#core/troop/error'
import { PricingService } from '#core/pricing/service'
import { now } from '#shared/time'

export interface CancelTroopParams {
  city_id: string
  player_id: string
}

export async function cancelTroop({
  city_id,
  player_id,
}: CancelTroopParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troop:cancel')
  logger.info('run')

  const city_cell = await repository.cell.getCityCell({ city_id })
  const troop = await repository.troop.getInProgress({ cell_id: city_cell.id })

  if (!troop) {
    throw new Error(TroopError.NOT_IN_PROGRESS)
  }

  const city = await repository.city.get(city_id)

  const updated_troop = troop.progressRecruitment({ progress_time: now() })
  const troop_costs = PricingService.getTroopCost({
    code: troop.code,
    count: updated_troop.ongoing_recruitment?.remaining_count ?? 0,
    cloning_factory_level: 0,
    replication_catalyst_level: 0,
  })

  const updated_city = city.refund({
    resource: troop_costs.resource,
    player_id,
  })

  const troop_to_save = updated_troop.cancel()

  await Promise.all([
    repository.troop.updateOne(troop_to_save),
    repository.city.updateOne(updated_city),
  ])
}
