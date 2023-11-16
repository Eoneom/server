import { GenericCommand } from '#app/command/generic'
import { AppService } from '#app/service'
import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { PricingService } from '#core/pricing/service'
import {
  Levels, RequirementService
} from '#core/requirement/service'
import { TechnologyCode } from '#core/technology/constant/code'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { now } from '#shared/time'
import assert from 'assert'

interface TroupRecruitRequest {
  city_id: string
  troup_code: TroupCode
  count: number
  player_id: string
}

export interface TroupRecruitExec {
  city: CityEntity
  cloning_factory_level: number
  replication_catalyst_level: number
  count: number
  is_recruitment_in_progress: boolean
  levels: Levels
  player_id: string
  troup: TroupEntity
}

interface TroupRecruitSave {
  city: CityEntity
  troup: TroupEntity
}

interface TroupRecruitResponse {
  recruit_at: number
}

export class TroupRecruitCommand extends GenericCommand<
  TroupRecruitRequest,
  TroupRecruitExec,
  TroupRecruitSave,
  TroupRecruitResponse
> {
  constructor() {
    super({ name: 'app:command:troup:recruit' })
  }

  async fetch({
    city_id,
    player_id,
    troup_code,
    count
  }: TroupRecruitRequest): Promise<TroupRecruitExec> {
    const [
      city_cell,
      city,
      cloning_factory_level,
      replication_catalyst_level,
      levels
    ] = await Promise.all([
      this.repository.cell.getCityCell({ city_id }),
      this.repository.city.get(city_id),
      this.repository.building.getLevel({
        city_id,
        code: BuildingCode.CLONING_FACTORY
      }),
      this.repository.technology.getLevel({
        player_id,
        code: TechnologyCode.REPLICATION_CATALYST
      }),
      AppService.getTroupRequirementLevels({
        city_id,
        player_id,
        troup_code
      })
    ])

    const [
      troup,
      is_recruitment_in_progress
    ] = await Promise.all([
      this.repository.troup.getInCell({
        cell_id: city_cell.id,
        code: troup_code
      }),
      this.repository.troup.isInProgress({ cell_id: city_cell.id })
    ])

    return {
      city,
      cloning_factory_level,
      count,
      is_recruitment_in_progress,
      levels,
      player_id,
      replication_catalyst_level,
      troup,
    }
  }
  exec({
    city,
    count,
    is_recruitment_in_progress,
    player_id,
    troup,
    cloning_factory_level,
    replication_catalyst_level,
    levels
  }: TroupRecruitExec): TroupRecruitSave {
    if (is_recruitment_in_progress) {
      throw new Error(TroupError.ALREADY_IN_PROGRESS)
    }

    RequirementService.checkTroupRequirement({
      troup_code: troup.code,
      levels,
    })

    const {
      resource, duration
    } = PricingService.getTroupCost({
      code: troup.code,
      count,
      cloning_factory_level,
      replication_catalyst_level
    })

    const updated_city = city.purchase({
      player_id,
      resource
    })

    const updated_troup = troup.launchRecruitment({
      count,
      duration,
      recruitment_time: now()
    })

    return {
      troup: updated_troup,
      city: updated_city
    }
  }
  async save({
    troup,
    city
  }: TroupRecruitSave): Promise<TroupRecruitResponse> {
    await Promise.all([
      this.repository.troup.updateOne(troup),
      this.repository.city.updateOne(city)
    ])

    assert(troup.ongoing_recruitment)
    return { recruit_at: troup.ongoing_recruitment.finish_at }
  }
}
