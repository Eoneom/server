import { Resource } from '#shared/resource'

type LevelCostValueProps = {
  code: string
  level: number
  resource: Resource
  duration: number
}

export class LevelCostValue {
  readonly code: string
  readonly level: number
  readonly resource: Resource
  readonly duration: number

  private constructor({
    code,
    level,
    resource,
    duration
  }: LevelCostValueProps) {
    this.code = code
    this.level = level
    this.resource = resource
    this.duration = duration
  }

  static create(props: LevelCostValueProps): LevelCostValue {
    return new LevelCostValue(props)
  }
}
