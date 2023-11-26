import { MovementAction } from '#core/troup/constant/movement-action'
import { BaseEntity } from '#core/type/base.entity'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'

type MovementEntityProps = BaseEntity & {
  player_id: string
  action: MovementAction
  origin: Coordinates
  destination: Coordinates
  arrive_at: number
}

export class MovementEntity extends BaseEntity {
  readonly player_id: string
  readonly action: MovementAction
  readonly origin: Coordinates
  readonly destination: Coordinates
  readonly arrive_at: number

  private constructor({
    id,
    player_id,
    action,
    origin,
    destination,
    arrive_at,
  }: MovementEntityProps) {
    super({ id })

    this.player_id = player_id
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

  isOwnedBy(player_id: string): boolean {
    return this.player_id === player_id
  }
}
