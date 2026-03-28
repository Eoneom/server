import { GenericQuery } from '#query/generic'
import { PricingService } from '#core/pricing/service'
import { TroopEntity } from '#core/troop/entity'
import { CountCostValue } from '#core/pricing/value/count'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { BuildingCode } from '#core/building/constant/code'
import { TechnologyCode } from '#core/technology/constant/code'
import { TroopError } from '#core/troop/error'

export interface TroopGetQueryRequest {
  troop_id: string
  player_id: string
}

export interface TroopGetQueryResponse {
  troop: TroopEntity
  cost: CountCostValue
  requirement: RequirementValue
}

export class TroopGetQuery extends GenericQuery<TroopGetQueryRequest, TroopGetQueryResponse> {
  constructor() {
    super({ name: 'troop:get' })
  }

  protected async get({
    troop_id,
    player_id
  }: TroopGetQueryRequest): Promise<TroopGetQueryResponse> {
    const troop = await this.repository.troop.getById(troop_id)
    if (!troop.isOwnedBy(player_id)) {
      throw new Error(TroopError.NOT_OWNER)
    }

    const [
      cloning_factory_level,
      replication_catalyst_level
    ] = await Promise.all([
      this.getCloningFactoryLevel(troop.cell_id),
      this.repository.technology.getLevel({
        player_id,
        code: TechnologyCode.REPLICATION_CATALYST
      })
    ])

    const cost = PricingService.getTroopCost({
      code: troop.code,
      count: 1,
      cloning_factory_level,
      replication_catalyst_level
    })

    const requirement = RequirementService.getTroopRequirement({ troop_code: troop.code })

    return {
      troop,
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
