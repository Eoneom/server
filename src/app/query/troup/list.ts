import { GenericQuery } from '#query/generic'
import { PricingService } from '#core/pricing/service'
import { TroupEntity } from '#core/troup/entity'
import { CountCostValue } from '#core/pricing/value/count'
import { TroupCode } from '#core/troup/constant'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'

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
  async get({ city_id }: TroupListQueryRequest): Promise<TroupListQueryResponse> {
    const troups = await this.repository.troup.listInCity({ city_id })
    const costs = troups.reduce((acc, troup) => {
      const cost = PricingService.getTroupCost({
        code: troup.code,
        count: 1,
      })

      return {
        ...acc,
        [troup.id]: cost
      }
    }, {} as Record<string, CountCostValue>)

    const requirement = RequirementService.listTroupRequirements()

    return {
      troups,
      costs,
      requirement
    }
  }
}
