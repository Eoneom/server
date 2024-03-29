import { BuildingCode } from '#core/building/constant/code'
import { now } from '#shared/time'
import {
  BaseEntity,
  BaseEntityProps
} from '#core/type/base.entity'
import { BuildingError } from '#core/building/error'

type BuildingEntityProps = BaseEntityProps & {
  city_id: string
  code: BuildingCode
  level: number
  upgrade_at?: number
}

export class BuildingEntity extends BaseEntity {
  readonly city_id: string
  readonly code: BuildingCode
  readonly level: number
  readonly upgrade_at: number | null

  private constructor({
    id,
    city_id,
    code,
    level,
    upgrade_at
  }: BuildingEntityProps) {
    super({ id })

    this.city_id = city_id
    this.code = code
    this.level = level
    this.upgrade_at = upgrade_at ?? null
  }

  static create(props: BuildingEntityProps): BuildingEntity {
    return new BuildingEntity(props)
  }

  cancel(): BuildingEntity {
    return new BuildingEntity({
      ...this,
      upgrade_at: undefined
    })
  }

  launchUpgrade({
    duration,
    is_building_in_progress
  }: {
    duration: number
    is_building_in_progress: boolean
  }): BuildingEntity {
    if (is_building_in_progress) {
      throw new Error(BuildingError.ALREADY_IN_PROGRESS)
    }

    return new BuildingEntity({
      ...this,
      upgrade_at: now() + duration * 1000
    })
  }

  finishUpgrade(): BuildingEntity {
    return new BuildingEntity({
      ...this,
      level: this.level + 1,
      upgrade_at: undefined,
    })
  }
}
