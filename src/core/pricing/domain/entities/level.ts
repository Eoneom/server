import { Resource } from '#shared/resource'
import { BaseEntity } from '#type/domain'

type LevelCostEntityProps = BaseEntity & {
  code: string
  level: number
  resource: Resource
  duration: number
}

export class LevelCostEntity extends BaseEntity {
  readonly code: string
  readonly level: number
  readonly resource: Resource
  readonly duration: number

  private constructor({
    id,
    code,
    level,
    resource,
    duration
  }: LevelCostEntityProps) {
    super({ id })

    this.code = code
    this.level = level
    this.resource = resource
    this.duration = duration
  }

  static create(props: LevelCostEntityProps): LevelCostEntity {
    return new LevelCostEntity(props)
  }
}
