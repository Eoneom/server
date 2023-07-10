import { BaseEntity } from '../../../../type/domain'
import { Resource } from '../../../../shared/resource'

type UnitCostEntityProps = BaseEntity & {
  code: string
  resource: Resource
  duration: number
}

export class UnitCostEntity extends BaseEntity {
  readonly code: string
  readonly resource: Resource
  readonly duration: number

  private constructor({
    id,
    code,
    resource,
    duration
  }: UnitCostEntityProps) {
    super({ id })

    this.code = code
    this.resource = resource
    this.duration = duration
  }

  static create(props: UnitCostEntityProps): UnitCostEntity {
    return new UnitCostEntity(props)
  }
}
