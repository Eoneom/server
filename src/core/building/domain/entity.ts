import { BaseEntity, BaseEntityProps } from '../../../types/domain'

import { now } from '../../shared/time'

type BuildingEntityProps = BaseEntityProps & {
  city_id: string
  code: string
  level: number
  upgrade_time?: number
}

export class BuildingEntity extends BaseEntity {
  readonly city_id: string
  readonly code: string
  readonly level: number
  readonly upgrade_time?: number

  constructor({
    id,
    city_id,
    code,
    level,
    upgrade_time
  }: BuildingEntityProps) {
    super({ id })

    this.city_id = city_id
    this.code = code
    this.level = level
    this.upgrade_time = upgrade_time
  }

  launchUpgrade(upgrade_time: number): BuildingEntity {
    return new BuildingEntity({
      ...this,
      upgrade_time: now() + upgrade_time
    })
  }
}
