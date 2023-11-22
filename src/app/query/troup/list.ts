import { GenericQuery } from '#query/generic'
import { PricingService } from '#core/pricing/service'
import { TroupEntity } from '#core/troup/entity'
import { CountCostValue } from '#core/pricing/value/count'
import { TroupCode } from '#core/troup/constant/code'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { CityError } from '#core/city/error'
import { TroupService } from '#core/troup/service'
import { BuildingCode } from '#core/building/constant/code'
import { TechnologyCode } from '#core/technology/constant/code'

export interface TroupListQueryRequest {
  city_id: string,
  player_id: string
}

export interface TroupListQueryResponse {
  troups: TroupEntity[],
  costs: Record<string, CountCostValue>
  requirement: Record<TroupCode, RequirementValue>
}

export class TroupListQuery extends GenericQuery<TroupListQueryRequest, TroupListQueryResponse> {
  constructor() {
    super({ name: 'troup:list' })
  }

  protected async get({
    city_id,
    player_id
  }: TroupListQueryRequest): Promise<TroupListQueryResponse> {
    const city = await this.repository.city.get(city_id)
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const cell = await this.repository.cell.getCityCell({ city_id })

    const [
      troups,
      cloning_factory_level,
      replication_catalyst_level
    ] = await Promise.all([
      this.repository.troup.listInCell({
        cell_id: cell.id,
        player_id
      }),
      this.repository.building.getLevel({
        city_id,
        code: BuildingCode.CLONING_FACTORY
      }),
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
        [troup.id]: cost
      }
    }, {} as Record<string, CountCostValue>)

    const requirement = RequirementService.listTroupRequirements()

    return {
      troups: TroupService.sortTroups({ troups }),
      costs,
      requirement
    }
  }
}
