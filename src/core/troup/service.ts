import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
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
    cell_id
  }: {
    player_id: string
    cell_id: string
  }): TroupEntity[] {
    const troups = Object.values(TroupCode).map(code => TroupEntity.init({
      cell_id,
      player_id,
      code
    }))

    return troups
  }

  static move({
    origin_troups,
    destination,
    troups_to_move,
    start_at,
    origin,
    distance,
    action
  }: {
    action: MovementAction
    distance: number
    start_at: number
    origin: Coordinates
    destination: Coordinates
    origin_troups: TroupEntity[],
    troups_to_move: {
      code: TroupCode
      count: number
    }[]
  }): {
    origin_troups: TroupEntity[],
    movement_troups: TroupEntity[],
    movement: MovementEntity
  } {
    troups_to_move.forEach(troup_to_move => {
      const origin_troup = origin_troups.find(t => t.code === troup_to_move.code)
      if (!origin_troup || origin_troup.count < troup_to_move.count) {
        throw new Error(TroupError.NOT_ENOUGH_TROUPS)
      }
    })

    const duration = this.getMovementDuration({ distance })
    const movement = MovementEntity.create({
      id: id(),
      player_id: origin_troups[0].player_id,
      action,
      origin,
      destination,
      arrive_at: start_at + duration,
    })
    return {
      origin_troups: origin_troups.map(origin_troup => {
        const troup_to_move = troups_to_move.find(t => t.code === origin_troup.code)
        if (!troup_to_move) {
          return origin_troup
        }

        return TroupEntity.create({
          ...origin_troup,
          count: origin_troup.count - troup_to_move.count
        })
      }),
      movement_troups: troups_to_move.map(troup_to_move => {
        const origin_troup = origin_troups.find(t => t.code === troup_to_move.code)
        assert(origin_troup)
        return TroupEntity.create({
          ...origin_troup,
          id: id(),
          count: troup_to_move.count,
          movement_id: movement.id,
          ongoing_recruitment: null,
          cell_id: null
        })
      }),
      movement
    }
  }

  static mergeTroupsInDestination({
    movement_troups,
    destination_troups,
    destination_cell_id
  }: {
    movement_troups: TroupEntity[]
    destination_troups: TroupEntity[]
    destination_cell_id: string
  }): {
    merged_troups: TroupEntity[]
  } {
    const merged_troups = destination_troups
    movement_troups.forEach(movement_troup => {
      const destination_troup_index = merged_troups.findIndex(merged_troup => merged_troup.code === movement_troup.code)
      if (destination_troup_index === -1) {
        const movement_troup_assigned_to_destination = movement_troup.assignToCell({ cell_id: destination_cell_id })
        merged_troups.push(movement_troup_assigned_to_destination)
      } else {
        const merged_troup_in_destination = TroupEntity.create({
          ...merged_troups[destination_troup_index],
          count: merged_troups[destination_troup_index].count + movement_troup.count,
        })

        merged_troups[destination_troup_index] = merged_troup_in_destination
      }
    })

    return { merged_troups }
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
      player_id: troup.player_id,
      action: MovementAction.BASE,
      origin: explore_movement.destination,
      destination: explore_movement.origin,
      arrive_at: start_at + duration
    })

    return {
      base_movement,
      troup: troup.assignToMovement({ movement_id: base_movement.id })
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
