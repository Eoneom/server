import { MovementAction } from '#core/troup/constant'
import { BaseEntity } from '#core/type/entity'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'

type MovementEntityProps = BaseEntity & {
  action: MovementAction
  origin: Coordinates
  destination: Coordinates
  arrive_at: number
}

export class MovementEntity extends BaseEntity {
  readonly action: MovementAction
  readonly origin: Coordinates
  readonly destination: Coordinates
  readonly arrive_at: number

  private constructor({
    id,
    action,
    origin,
    destination,
    arrive_at,
  }: MovementEntityProps) {
    super({ id })

    this.action = action
    this.origin = origin
    this.destination = destination
    this.arrive_at = arrive_at
  }

  static create(props: MovementEntityProps): MovementEntity {
    return new MovementEntity(props)
  }

  isArrived(): boolean {
    return this.arrive_at < now()
  }
}
