import { BaseEntity, BaseEntityProps } from '../../../types/domain'

import { BuildingCode } from './constants'
import { now } from '../../shared/time'

type BuildingEntityProps = BaseEntityProps & {
  city_id: string
  code: BuildingCode
  level: number
  upgraded_at?: number
}

export class BuildingEntity extends BaseEntity {
  readonly city_id: string
  readonly code: BuildingCode
  readonly level: number
  readonly upgraded_at: number | null

  private constructor({
    id,
    city_id,
    code,
    level,
    upgraded_at
  }: BuildingEntityProps) {
    super({ id })

    this.city_id = city_id
    this.code = code
    this.level = level
    this.upgraded_at = upgraded_at ?? null
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

  static initResearchLab({ city_id }: { city_id: string }): BuildingEntity {
    return new BuildingEntity({
      id: 'fake',
      city_id,
      code: BuildingCode.RESEARCH_LAB,
      level: 0
    })
  }

  launchUpgrade(upgrade_time_in_seconds: number): BuildingEntity {
    return new BuildingEntity({
      ...this,
      upgraded_at: now() + upgrade_time_in_seconds * 1000
    })
  }

  finishUpgrade(): BuildingEntity {
    return new BuildingEntity({
      ...this,
      level: this.level + 1,
      upgraded_at: undefined,
    })
  }
}
