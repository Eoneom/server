import { now } from '../shared/time'

interface BuildingEntityProps {
  id: string
  city_id: string
  code: string
  level: number
  upgrade_time?: number
}

export class BuildingEntity {
  readonly id: string
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
    this.id = id
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
