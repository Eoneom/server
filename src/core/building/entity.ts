import { BuildingCode } from '#core/building/constants'
import { FAKE_ID } from '#shared/identification'
import { now } from '#shared/time'
import {
  BaseEntity, BaseEntityProps
} from '#type/domain'

type BuildingEntityProps = BaseEntityProps & {
  city_id: string
  code: BuildingCode
  name: string
  level: number
  upgrade_at?: number
}

export class BuildingEntity extends BaseEntity {
  readonly city_id: string
  readonly code: BuildingCode
  readonly name: string
  readonly level: number
  readonly upgrade_at: number | null

  private constructor({
    id,
    city_id,
    code,
    name,
    level,
    upgrade_at
  }: BuildingEntityProps) {
    super({ id })

    this.city_id = city_id
    this.code = code
    this.name = name
    this.level = level
    this.upgrade_at = upgrade_at ?? null
  }

  static create(props: BuildingEntityProps): BuildingEntity {
    return new BuildingEntity(props)
  }

  static initRecyclingPlant({ city_id }: { city_id: string }): BuildingEntity {
    return new BuildingEntity({
      id: FAKE_ID,
      city_id,
      code: BuildingCode.RECYCLING_PLANT,
      name: 'Centre de recyclage',
      level: 0
    })
  }

  static initMushroomFarm({ city_id }: { city_id: string }): BuildingEntity {
    return new BuildingEntity({
      id: FAKE_ID,
      city_id,
      code: BuildingCode.MUSHROOM_FARM,
      name: 'Ferme à champignons',
      level: 0
    })
  }

  static initResearchLab({ city_id }: { city_id: string }): BuildingEntity {
    return new BuildingEntity({
      id: FAKE_ID,
      city_id,
      code: BuildingCode.RESEARCH_LAB,
      name: 'Laboratoire de recherche',
      level: 0
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
