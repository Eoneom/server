import { BaseEntity } from '#core/type/entity'
import { Coordinates } from '#core/world/value/coordinates'

type MovementEntityProps = BaseEntity & {
  origin: Coordinates
  destination: Coordinates
  arrive_at: number
}

export class MovementEntity extends BaseEntity {
  readonly origin: Coordinates
  readonly destination: Coordinates
  readonly arrive_at: number

  private constructor({
    id,
    origin,
    destination,
    arrive_at,
  }: MovementEntityProps) {
    super({ id })

    this.origin = origin
    this.destination = destination
    this.arrive_at = arrive_at
  }

  static create(props: MovementEntityProps): MovementEntity {
    return new MovementEntity(props)
  }
}
