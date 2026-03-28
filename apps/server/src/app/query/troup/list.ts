import { GenericQuery } from '#query/generic'
import { TroupEntity } from '#core/troup/entity'
import { CityError } from '#core/city/error'
import { TroupService } from '#core/troup/service'
import { CellEntity } from '#core/world/cell.entity'
import { OutpostError } from '#core/outpost/error'
import { CountCostValue } from '#core/pricing/value/count'
import { TroupCode } from '#core/troup/constant/code'
import { TechnologyCode } from '#core/technology/constant/code'
import { BuildingCode } from '#core/building/constant/code'
import { PricingService } from '#core/pricing/service'

type Location = { type: 'city', city_id: string} | { type: 'outpost', outpost_id: string }

export interface TroupListQueryRequest {
  location: Location
  player_id: string
}

export interface TroupListQueryResponse {
  troups: TroupEntity[]
  costs: Record<TroupCode, CountCostValue>
}

export class TroupListQuery extends GenericQuery<TroupListQueryRequest, TroupListQueryResponse> {
  constructor() {
    super({ name: 'troup:list' })
  }

  protected async get({
    location,
    player_id
  }: TroupListQueryRequest): Promise<TroupListQueryResponse> {
    const cell = await this.getCellOfLocation({
      player_id,
      location
    })

    const [
      troups,
      cloning_factory_level,
      replication_catalyst_level
    ] = await Promise.all([
      this.repository.troup.listInCell({
        cell_id: cell.id,
        player_id
      }),
      location.type === 'city' ? this.repository.building.getLevel({
        city_id: location.city_id,
        code: BuildingCode.CLONING_FACTORY
      }): 0,
      this.repository.technology.getLevel({
        player_id,
        code: TechnologyCode.REPLICATION_CATALYST
      })
    ])

    const costs = troups.reduce((acc, troup) => {
      const cost = PricingService.getTroupCost({
        code: troup.code,
        count: 1,
        cloning_factory_level,
        replication_catalyst_level
      })

      return {
        ...acc,
        [troup.code]: cost
      }
    }, {} as Record<TroupCode, CountCostValue>)

    return {
      troups: TroupService.sortTroups({ troups }),
      costs
    }
  }

  private async getCellOfLocation({
    player_id,
    location
  }: {
    player_id: string
    location: Location
  }): Promise<CellEntity> {
    if (location.type === 'city') {
      const city = await this.repository.city.get(location.city_id)
      if (!city.isOwnedBy(player_id)) {
        throw new Error(CityError.NOT_OWNER)
      }

      return this.repository.cell.getCityCell({ city_id: city.id })
    }

    const outpost = await this.repository.outpost.getById(location.outpost_id)
    if (!outpost.isOwnedBy(player_id)) {
      throw new Error(OutpostError.NOT_OWNER)
    }

    return this.repository.cell.getById(outpost.cell_id)
  }
}
