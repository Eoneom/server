import { MovementAction } from './constant/movement-action'
import { troup_order } from '#core/troup/constant/order'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { Coordinates } from '#core/world/value/coordinates'
import { id } from '#shared/identification'
import assert from 'assert'

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
    distance,
    action
  }: {
    troup: TroupEntity,
    origin: Coordinates
    destination: Coordinates
    count_to_move: number
    start_at: number
    distance: number
    action: MovementAction
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
      action,
      origin,
      destination,
      arrive_at: start_at + duration,
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

  static finishBaseInCity({
    troups,
    city_troups
  }: {
    troups: TroupEntity[]
    city_troups: TroupEntity[]
  }): {
    city_troups: TroupEntity[]
  } {
    const new_city_troups = city_troups.map(city_troup => {
      const troup = troups.find(t => t.code === city_troup.code)
      assert.ok(troup)

      return TroupEntity.create({
        ...city_troup,
        count: city_troup.count + troup.count
      })
    })

    return { city_troups: new_city_troups }
  }

  static finishExploration({
    troup,
    explore_movement,
    start_at,
    distance
  }: {
    troup: TroupEntity
    explore_movement: MovementEntity
    start_at: number
    distance: number
   }): {
    base_movement: MovementEntity,
    troup: TroupEntity
  } {
    assert.strictEqual(explore_movement.action, MovementAction.EXPLORE)

    const duration = this.getMovementDuration({ distance })
    const base_movement = MovementEntity.create({
      id: id(),
      action: MovementAction.BASE,
      origin: explore_movement.destination,
      destination: explore_movement.origin,
      arrive_at: start_at + duration
    })

    return {
      base_movement,
      troup: TroupEntity.create({
        ...troup,
        movement_id: base_movement.id
      })
    }
  }

  static sortTroups({ troups } : {troups: TroupEntity[]}): TroupEntity[] {
    return troups.sort((a, b) => troup_order[a.code] - troup_order[b.code])
  }

  private static getMovementDuration({ distance }: {
    distance: number
  }): number {
    return distance
  }
}
