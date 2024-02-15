import { GenericQuery } from '#query/generic'
import { PricingService } from '#core/pricing/service'
import { TroupEntity } from '#core/troup/entity'
import { CountCostValue } from '#core/pricing/value/count'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { BuildingCode } from '#core/building/constant/code'
import { TechnologyCode } from '#core/technology/constant/code'
import { TroupError } from '#core/troup/error'

export interface TroupGetQueryRequest {
  troup_id: string
  player_id: string
}

export interface TroupGetQueryResponse {
  troup: TroupEntity
  cost: CountCostValue
  requirement: RequirementValue
}

export class TroupGetQuery extends GenericQuery<TroupGetQueryRequest, TroupGetQueryResponse> {
  constructor() {
    super({ name: 'troup:get' })
  }

  protected async get({
    troup_id,
    player_id
  }: TroupGetQueryRequest): Promise<TroupGetQueryResponse> {
    const troup = await this.repository.troup.getById(troup_id)
    if (!troup.isOwnedBy(player_id)) {
      throw new Error(TroupError.NOT_OWNER)
    }

    const [
      cloning_factory_level,
      replication_catalyst_level
    ] = await Promise.all([
      this.getCloningFactoryLevel(troup.cell_id),
      this.repository.technology.getLevel({
        player_id,
        code: TechnologyCode.REPLICATION_CATALYST
      })
    ])

    const cost = PricingService.getTroupCost({
      code: troup.code,
      count: 1,
      cloning_factory_level,
      replication_catalyst_level
    })

    const requirement = RequirementService.getTroupRequirement({ troup_code: troup.code })

    return {
      troup,
      cost,
      requirement
    }
  }

  private async getCloningFactoryLevel(cell_id: string | null): Promise<number> {
    if (!cell_id) {
      return 0
    }

    const cell = await this.repository.cell.getById(cell_id)
    if (!cell.city_id) {
      return 0
    }

    return this.repository.building.getLevel({
      city_id: cell.city_id,
      code: BuildingCode.CLONING_FACTORY
    })
  }
}
