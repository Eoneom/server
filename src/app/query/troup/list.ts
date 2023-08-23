import { GenericQuery } from '#query/generic'
import { PricingService } from '#core/pricing/service'
import { TroupEntity } from '#core/troup/entity'
import { CountCostValue } from '#core/pricing/value/count'

export interface TroupListQueryRequest {
  city_id: string,
  player_id: string
}

export interface TroupListQueryResponse {
  troups: TroupEntity[],
  costs: Record<string, CountCostValue>
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

    return {
      troups,
      costs
    }
  }
}
