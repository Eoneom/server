import { GenericCommand } from '#app/command/generic'
import { AppService } from '#app/service'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { PricingService } from '#core/pricing/service'
import {
  Levels, RequirementService
} from '#core/requirement/service'
import { TroupCode } from '#core/troup/constant'
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
  count: number
  is_recruitment_in_progress: boolean
  player_id: string
  levels: Levels
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
      troup,
      is_recruitment_in_progress,
      city,
      levels
    ] = await Promise.all([
      this.repository.troup.getInCity({
        city_id,
        code: troup_code
      }),
      this.repository.troup.isInProgress({ city_id }),
      this.repository.city.get(city_id),
      AppService.getTroupRequirementLevels({
        city_id,
        player_id,
        troup_code
      })
    ])

    return {
      troup,
      count,
      city,
      is_recruitment_in_progress,
      player_id,
      levels
    }
  }
  exec({
    city,
    count,
    is_recruitment_in_progress,
    player_id,
    troup,
    levels
  }: TroupRecruitExec): TroupRecruitSave {
    if (is_recruitment_in_progress) {
      throw new Error(TroupError.ALREADY_IN_PROGRESS)
    }

    RequirementService.checkTroupRequirement({
      troup_code: troup.code,
      levels,
    })

    const troup_cost = PricingService.getTroupCost({
      code: troup.code,
      count
    })

    const updated_city = CityService.purchase({
      city,
      player_id,
      cost: troup_cost.resource
    })

    const updated_troup = troup.launchRecruitment({
      count,
      duration: troup_cost.duration,
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
