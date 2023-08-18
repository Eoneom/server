import { BaseEntity } from '#core/type/entity'
import { CellType } from '#core/world/value/cell-type'
import { Coordinates } from '#core/world/value/coordinates'
import { Resource } from '#shared/resource'

type CellEntityProps = BaseEntity & {
  coordinates: Coordinates
  type: CellType
  resource_coefficient: Resource
  city_id?: string
}

export class CellEntity extends BaseEntity {
  readonly coordinates: Coordinates
  readonly type: CellType
  readonly resource_coefficient: Resource
  readonly city_id?: string

  private constructor({
    id,
    coordinates,
    type,
    resource_coefficient,
    city_id,
  }: CellEntityProps) {
    super({ id })

    this.coordinates = coordinates
    this.type = type
    this.resource_coefficient = resource_coefficient
    this.city_id = city_id
  }

  static create(props: CellEntityProps): CellEntity {
    return new CellEntity(props)
  }

  assign({ city_id }: {city_id: string }): CellEntity {
    return CellEntity.create({
      ...this,
      city_id
    })
  }

  isAssigned(): boolean {
    return Boolean(this.city_id)
  }
}
