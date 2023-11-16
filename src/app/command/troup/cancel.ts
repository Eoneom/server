import { GenericCommand } from '#command/generic'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { CityEntity } from '#core/city/entity'
import { PricingService } from '#core/pricing/service'
import { now } from '#shared/time'

interface TroupCancelRequest {
  city_id: string
  player_id: string
}

interface TroupCancelExec {
  city: CityEntity
  player_id: string
  troup: TroupEntity | null
}

interface TroupCancelSave {
  troup: TroupEntity
  city: CityEntity
}

export class TroupCancelCommand extends GenericCommand<
  TroupCancelRequest,
  TroupCancelExec,
  TroupCancelSave
> {
  constructor() {
    super({ name: 'troup:cancel' })
  }

  async fetch({
    city_id,
    player_id
  }: TroupCancelRequest): Promise<TroupCancelExec> {
    const city_cell = await this.repository.cell.getCityCell({ city_id })
    const [
      city,
      troup
    ] = await Promise.all([
      this.repository.city.get(city_id),
      this.repository.troup.getInProgress({ cell_id: city_cell.id })
    ])

    return {
      city,
      player_id,
      troup
    }
  }

  exec({
    city,
    player_id,
    troup
  }: TroupCancelExec): TroupCancelSave {
    if (!troup) {
      throw new Error(TroupError.NOT_IN_PROGRESS)
    }

    const updated_troup = troup.progressRecruitment({ progress_time: now() })
    const troup_costs = PricingService.getTroupCost({
      code: troup.code,
      count: updated_troup.ongoing_recruitment?.remaining_count ?? 0,
      cloning_factory_level: 0,
      replication_catalyst_level: 0
    })

    const updated_city = city.refund({
      resource: troup_costs.resource,
      player_id,
    })

    return {
      troup: updated_troup.cancel(),
      city: updated_city
    }
  }

  async save({
    troup,
    city
  }: TroupCancelSave): Promise<void> {
    await Promise.all([
      this.repository.troup.updateOne(troup),
      this.repository.city.updateOne(city)
    ])
  }
}
