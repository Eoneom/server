import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { Coordinates } from '#core/world/value/coordinates'
import { id } from '#shared/identification'

export class TroupService {
  static init({
    player_id,
    city_id
  }: {
    player_id: string
    city_id: string
  }): TroupEntity[] {
    const explorer = TroupEntity.initExplorer({
      city_id,
      player_id
    })

    return [ explorer ]
  }

  static move({
    troup,
    destination,
    count_to_move,
    start_at,
    origin,
    distance
  }: {
    troup: TroupEntity,
    origin: Coordinates
    destination: Coordinates
    count_to_move: number
    start_at: number
    distance: number
  }): {
    city_troup: TroupEntity,
    movement_troup: TroupEntity,
    movement: MovementEntity
  } {
    if (troup.count < count_to_move) {
      throw new Error(TroupError.NOT_ENOUGH_TROUPS)
    }

    const duration = this.getMovementDuration({ distance })
    const movement = MovementEntity.create({
      id: id(),
      origin,
      destination,
      arrive_at: start_at + duration
    })
    return {
      city_troup: TroupEntity.create({
        ...troup,
        count: troup.count - count_to_move
      }),
      movement_troup: TroupEntity.create({
        ...troup,
        id: id(),
        count: count_to_move,
        movement_id: movement.id,
        ongoing_recruitment: null
      }),
      movement
    }
  }

  private static getMovementDuration({ distance }: {
    distance: number
  }): number {
    return Math.ceil(distance / 10)
  }
}
