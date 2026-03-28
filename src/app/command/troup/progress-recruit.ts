import { Factory } from '#adapter/factory'
import { CityError } from '#core/city/error'
import { TroupError } from '#core/troup/error'
import { now } from '#shared/time'

export interface ProgressTroupRecruitmentParams {
  city_id: string
  player_id: string
}

export interface ProgressTroupRecruitmentResult {
  recruit_count: number
}

export async function progressTroupRecruitment({
  city_id,
  player_id,
}: ProgressTroupRecruitmentParams): Promise<ProgressTroupRecruitmentResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:progress-recruit')
  logger.info('run')

  const [ city_cell, city ] = await Promise.all([
    repository.cell.getCityCell({ city_id }),
    repository.city.get(city_id),
  ])

  if (!city.isOwnedBy(player_id)) {
    throw new Error(CityError.NOT_OWNER)
  }

  const troup = await repository.troup.getInProgress({ cell_id: city_cell.id })

  if (!troup) {
    throw new Error(TroupError.NOT_IN_PROGRESS)
  }

  const updated_troup = troup.progressRecruitment({ progress_time: now() })
  const recruit_count = updated_troup.count - troup.count

  await repository.troup.updateOne(updated_troup)

  return { recruit_count }
}
