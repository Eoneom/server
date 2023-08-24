import assert from 'assert'

import { Factory } from '#adapter/factory'
import { TroupCode } from '#core/troup/constant'
import { BaseEntity } from '#core/type/entity'
import { FAKE_ID } from '#shared/identification'

interface OngoingRecruitment {
  finish_at: number
  remaining_count: number
  last_progress: number
}

type TroupEntityProps = BaseEntity & {
  code: TroupCode
  player_id: string
  city_id: string | null
  count: number
  ongoing_recruitment: OngoingRecruitment | null
}

export class TroupEntity extends BaseEntity {
  readonly code: TroupCode
  readonly count: number
  readonly player_id: string
  readonly city_id: string | null
  readonly ongoing_recruitment: OngoingRecruitment | null

  private constructor({
    id,
    city_id,
    player_id,
    code,
    count,
    ongoing_recruitment
  }: TroupEntityProps) {
    super({ id })

    this.player_id = player_id
    this.city_id = city_id
    this.code = code
    this.count = count
    this.ongoing_recruitment = ongoing_recruitment
  }

  static create(props: TroupEntityProps): TroupEntity {
    return new TroupEntity(props)
  }

  static initScout({
    player_id,
    city_id
  }: {
    player_id: string
    city_id: string
  }): TroupEntity {
    return new TroupEntity({
      id: FAKE_ID,
      code: TroupCode.SCOUT,
      player_id,
      city_id,
      count: 0,
      ongoing_recruitment: null
    })
  }

  launchRecruitment({
    duration,
    count,
    recruitment_time
  }: {
    duration: number
    count: number
    recruitment_time: number
  }) {
    return TroupEntity.create({
      ...this,
      ongoing_recruitment: {
        finish_at: recruitment_time + duration * 1000,
        remaining_count: count,
        last_progress: recruitment_time
      }
    })
  }

  progressRecruitment({ progress_time }: { progress_time: number}): TroupEntity {
    assert(this.ongoing_recruitment)

    const { ongoing_recruitment } = this
    if (progress_time >= ongoing_recruitment.finish_at) {
      return TroupEntity.create({
        ...this,
        count: this.count + ongoing_recruitment.remaining_count,
        ongoing_recruitment: null
      })
    }

    const remaining_time = ongoing_recruitment.finish_at - ongoing_recruitment.last_progress

    const count_per_second = ongoing_recruitment.remaining_count / remaining_time

    const time_elapsed = progress_time - ongoing_recruitment.last_progress
    const count_since_last = Math.floor(count_per_second*time_elapsed)
    const logger = Factory.getLogger('troup:entity')
    logger.debug('recruit partially', {
      time_elapsed,
      count_since_last,
      count_per_second
    })

    return TroupEntity.create({
      ...this,
      count: this.count + count_since_last,
      ongoing_recruitment: {
        finish_at: ongoing_recruitment.finish_at,
        remaining_count: ongoing_recruitment.remaining_count - count_since_last,
        last_progress: count_since_last ? progress_time : ongoing_recruitment.last_progress
      }
    })
  }
}
