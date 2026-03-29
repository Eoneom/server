import assert from 'assert'

import { Factory } from '#adapter/factory'
import { TroopCode } from '#core/troop/constant/code'
import { BaseEntity } from '#core/type/base/entity'
import { id } from '#shared/identification'

interface OngoingRecruitment {
  finish_at: number
  remaining_count: number
  last_progress: number
  started_at: number
}

type TroopEntityProps = BaseEntity & {
  code: TroopCode
  player_id: string
  cell_id: string | null
  count: number
  ongoing_recruitment: OngoingRecruitment | null
  movement_id: string | null
}

export class TroopEntity extends BaseEntity {
  readonly code: TroopCode
  readonly count: number
  readonly player_id: string
  readonly cell_id: string | null
  readonly ongoing_recruitment: OngoingRecruitment | null
  readonly movement_id: string | null

  private constructor({
    id,
    cell_id,
    player_id,
    code,
    count,
    ongoing_recruitment,
    movement_id
  }: TroopEntityProps) {
    super({ id })

    this.player_id = player_id
    this.cell_id = cell_id
    this.code = code
    this.count = count
    this.ongoing_recruitment = ongoing_recruitment
    this.movement_id = movement_id
  }

  static create(props: TroopEntityProps): TroopEntity {
    assert(Boolean(props.cell_id) !== Boolean(props.movement_id))
    return new TroopEntity(props)
  }

  static init({
    player_id,
    cell_id,
    code
  }: {
    player_id: string
    cell_id: string
    code: TroopCode
  }): TroopEntity {
    return new TroopEntity({
      id: id(),
      code,
      player_id,
      cell_id,
      count: 0,
      ongoing_recruitment: null,
      movement_id: null
    })
  }

  assignToCell({ cell_id }: {cell_id: string}): TroopEntity {
    return TroopEntity.create({
      ...this,
      cell_id,
      movement_id: null
    })
  }

  assignToMovement({ movement_id }: { movement_id: string }): TroopEntity {
    return TroopEntity.create({
      ...this,
      movement_id,
      cell_id: null
    })
  }

  launchRecruitment({
    duration,
    count,
    recruitment_time,
  }: {
    duration: number
    count: number
    recruitment_time: number
  }) {
    return TroopEntity.create({
      ...this,
      ongoing_recruitment: {
        finish_at: recruitment_time + duration * 1000,
        remaining_count: count,
        last_progress: recruitment_time,
        started_at: recruitment_time
      }
    })
  }

  progressRecruitment({ progress_time }: { progress_time: number}): TroopEntity {
    assert(this.ongoing_recruitment)
    const logger = Factory.getLogger('troop:entity')
    const { ongoing_recruitment } = this
    if (progress_time >= ongoing_recruitment.finish_at) {
      logger.debug('recruit totally')
      return TroopEntity.create({
        ...this,
        count: this.count + ongoing_recruitment.remaining_count,
        ongoing_recruitment: null
      })
    }

    const remaining_time = ongoing_recruitment.finish_at - ongoing_recruitment.last_progress

    const count_per_second = ongoing_recruitment.remaining_count / remaining_time

    const time_elapsed = progress_time - ongoing_recruitment.last_progress
    const count_since_last = Math.floor(count_per_second*time_elapsed)
    logger.debug('recruit partially', {
      time_elapsed,
      count_since_last,
      count_per_second
    })

    return TroopEntity.create({
      ...this,
      count: this.count + count_since_last,
      ongoing_recruitment: {
        finish_at: ongoing_recruitment.finish_at,
        remaining_count: ongoing_recruitment.remaining_count - count_since_last,
        last_progress: count_since_last ? progress_time : ongoing_recruitment.last_progress,
        started_at: ongoing_recruitment.started_at
      }
    })
  }

  cancel(): TroopEntity {
    return TroopEntity.create({
      ...this,
      ongoing_recruitment: null
    })
  }

  removeCount(count_to_remove: number): TroopEntity {
    assert(count_to_remove <= this.count)

    return TroopEntity.create({
      ...this,
      count: this.count - count_to_remove
    })
  }

  isOwnedBy(player_id: string): boolean {
    return this.player_id === player_id
  }
}
