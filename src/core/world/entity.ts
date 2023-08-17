import { BaseEntity } from '#core/type/entity'
import { CellType } from '#core/world/value/cell-type'
import { Coordinates } from '#core/world/value/coordinates'
import { Resource } from '#shared/resource'

type CellEntityProps = BaseEntity & {
  coordinates: Coordinates
  type: CellType
  resource_coefficient: Resource
}

export class CellEntity extends BaseEntity {
  readonly coordinates: Coordinates
  readonly type: CellType
  readonly resource_coefficient: Resource

  private constructor({
    id,
    coordinates,
    type,
    resource_coefficient,
  }: CellEntityProps) {
    super({ id })

    this.coordinates = coordinates
    this.type = type
    this.resource_coefficient = resource_coefficient
  }

  static create(props: CellEntityProps): CellEntity {
    return new CellEntity(props)
  }
}
