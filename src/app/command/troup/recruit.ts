import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { BuildingCode } from '#core/building/constant/code'
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

export interface RecruitTroupParams {
  city_id: string
  troup_code: TroupCode
  count: number
  player_id: string
}

export interface RecruitTroupResult {
  recruit_at: number
}

export async function recruitTroup({
  city_id,
  player_id,
  troup_code,
  count,
}: RecruitTroupParams): Promise<RecruitTroupResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:recruit')
  logger.info('run')

  const [
    city_cell,
    city,
    cloning_factory_level,
    replication_catalyst_level,
    levels,
  ] = await Promise.all([
    repository.cell.getCityCell({ city_id }),
    repository.city.get(city_id),
    repository.building.getLevel({
      city_id,
      code: BuildingCode.CLONING_FACTORY,
    }),
    repository.technology.getLevel({
      player_id,
      code: TechnologyCode.REPLICATION_CATALYST,
    }),
    AppService.getTroupRequirementLevels({
      city_id,
      player_id,
      troup_code,
    }),
  ])

  const [ troup, is_recruitment_in_progress ] = await Promise.all([
    repository.troup.getInCell({
      cell_id: city_cell.id,
      code: troup_code,
    }),
    repository.troup.isInProgress({ cell_id: city_cell.id }),
  ])

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
    replication_catalyst_level,
  })

  const updated_city = city.purchase({
    player_id,
    resource,
  })

  const updated_troup = troup.launchRecruitment({
    count,
    duration,
    recruitment_time: now(),
  })

  await Promise.all([
    repository.troup.updateOne(updated_troup),
    repository.city.updateOne(updated_city),
  ])

  assert(updated_troup.ongoing_recruitment)
  return { recruit_at: updated_troup.ongoing_recruitment.finish_at }
}
