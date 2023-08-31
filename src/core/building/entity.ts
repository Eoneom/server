import { BuildingCode } from '#core/building/constant'
import { FAKE_ID } from '#shared/identification'
import { now } from '#shared/time'
import {
  BaseEntity, BaseEntityProps
} from '#core/type/entity'

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

  launchUpgrade(upgrade_time_in_seconds: number): BuildingEntity {
    return new BuildingEntity({
      ...this,
      upgrade_at: now() + upgrade_time_in_seconds * 1000
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
