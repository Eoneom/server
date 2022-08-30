import { BaseEntity, BaseEntityProps } from '../../../types/domain'

import { BuildingCode } from './constants'
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
  readonly upgrade_time: number | null

  private constructor({
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
    this.upgrade_time = upgrade_time ?? null
  }

  static create(props: BuildingEntityProps): BuildingEntity {
    return new BuildingEntity(props)
  }

  static initRecyclingPlant({ city_id }: { city_id: string }): BuildingEntity {
    return new BuildingEntity({
      id: 'fake',
      city_id,
      code: BuildingCode.RECYCLING_PLANT,
      level: 1
    })
  }

  static initMushroomFarm({ city_id }: { city_id: string }): BuildingEntity {
    return new BuildingEntity({
      id: 'fake',
      city_id,
      code: BuildingCode.MUSHROOM_FARM,
      level: 1
    })
  }

  launchUpgrade(upgrade_time_in_seconds: number): BuildingEntity {
    return new BuildingEntity({
      ...this,
      upgrade_time: now() + upgrade_time_in_seconds * 1000
    })
  }

  finishUpgrade(): BuildingEntity {
    return new BuildingEntity({
      ...this,
      level: this.level + 1,
      upgrade_time: undefined,
    })
  }
}
