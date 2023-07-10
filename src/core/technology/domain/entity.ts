import { BaseEntity } from '../../../type/domain'
import { TechnologyCode } from './constants'
import { now } from '../../../shared/time'

type TechnologyEntityProps = BaseEntity & {
  code: TechnologyCode
  player_id: string
  level: number
  researched_at?: number
}

export class TechnologyEntity extends BaseEntity {
  readonly code: TechnologyCode
  readonly player_id: string
  readonly level: number
  readonly researched_at: number | null

  private constructor({
    id,
    code,
    player_id,
    level,
    researched_at
  }: TechnologyEntityProps) {
    super({ id })
    this.code = code
    this.player_id = player_id
    this.level = level
    this.researched_at = researched_at ?? null
  }

  static create(props: TechnologyEntityProps): TechnologyEntity {
    return new TechnologyEntity(props)
  }

  static initBuilding({ player_id }: { player_id: string }): TechnologyEntity {
    return new TechnologyEntity({
      id: 'fake',
      code: TechnologyCode.BUILDING,
      player_id,
      level: 0,
    })
  }

  launchResearch(research_duration: number): TechnologyEntity {
    return new TechnologyEntity({
      ...this,
      researched_at: now() + research_duration * 1000
    })
  }

  finishResearch(): TechnologyEntity {
    return new TechnologyEntity({
      ...this,
      level: this.level + 1,
      researched_at: undefined,
    })
  }
}
