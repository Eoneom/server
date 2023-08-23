import { TroupCode } from '#core/troup/constant'
import { BaseEntity } from '#core/type/entity'
import { FAKE_ID } from '#shared/identification'
import { now } from '#shared/time'

interface OngoingRecruitment {
  finish_at: number
  remaining_count: number
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
    count
  }: {
    duration: number
    count: number
  }) {
    return TroupEntity.create({
      ...this,
      ongoing_recruitment: {
        finish_at: now() + duration,
        remaining_count: count
      }
    })
  }
}
