import assert from 'assert'

import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { troup_order } from '#core/troup/constant/order'
import { troup_base_speed } from '#core/troup/constant/speed'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { Coordinates } from '#core/world/value/coordinates'
import { id } from '#shared/identification'
import { TroupCount } from '#core/troup/type'

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

  static haveEnoughTroups({
    origin_troups,
    move_troups
  }: {
    origin_troups: TroupCount[]
    move_troups: TroupCount[]
  }): boolean {
    const is_missing_troup = move_troups.some(move_troup => {
      const origin_troup = origin_troups.find(troup => troup.code === move_troup.code)
      return (origin_troup?.count ?? 0) < move_troup.count
    })

    return !is_missing_troup
  }

  static removeTroups({
    origin_troups,
    remove_troups
  }: {
    origin_troups: TroupEntity[]
    remove_troups: TroupCount[]
  }): TroupEntity[] {
    return origin_troups.map(origin_troup => {
      const troup_to_move = remove_troups.find(t => t.code === origin_troup.code)
      if (!troup_to_move) {
        return origin_troup
      }

      return TroupEntity.create({
        ...origin_troup,
        count: origin_troup.count - troup_to_move.count
      })
    })
  }

  static createMovementWithTroups({
    move_troups,
    player_id,
    action,
    origin,
    destination,
    start_at,
    distance
  }: {
    player_id: string
    move_troups: TroupCount[]
    action: MovementAction
    distance: number
    start_at: number
    origin: Coordinates
    destination: Coordinates
   }): {
    movement: MovementEntity
    troups: TroupEntity[]
  } {
    const duration = this.getMovementDuration({
      distance,
      troup_codes: move_troups.map(({ code }) => code)
    })

    const movement = MovementEntity.create({
      id: id(),
      player_id: player_id,
      action,
      origin,
      destination,
      arrive_at: Math.ceil(start_at + duration),
    })

    const troups = move_troups.map(move_troup => {
      return TroupEntity.create({
        id: id(),
        code: move_troup.code,
        player_id,
        count: move_troup.count,
        movement_id: movement.id,
        ongoing_recruitment: null,
        cell_id: null
      })
    })

    return {
      movement,
      troups
    }
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
    troups_to_move: TroupCount[]
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

    const duration = this.getMovementDuration({
      distance,
      troup_codes: troups_to_move.map(({ code }) => code)
    })
    const movement = MovementEntity.create({
      id: id(),
      player_id: origin_troups[0].player_id,
      action,
      origin,
      destination,
      arrive_at: Math.ceil(start_at + duration),
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

  static assignToCell({
    troups,
    cell_id
  }: {
    troups: TroupEntity[]
    cell_id: string
  }): TroupEntity[] {
    return troups.map(troup => troup.assignToCell({ cell_id }))
  }

  static assignToMovement({
    troups,
    movement_id
  }: {
    troups: TroupEntity[]
    movement_id: string
  }): TroupEntity[] {
    return troups.map(troup => troup.assignToMovement({ movement_id }))
  }

  static mergeTroupsInDestination({
    movement_troups,
    destination_troups,
  }: {
    movement_troups: TroupEntity[]
    destination_troups: TroupEntity[]
  }): {
    merged_troups: TroupEntity[]
  } {
    const merged_troups = [ ...destination_troups ]
    movement_troups.forEach(movement_troup => {
      const destination_troup_index = merged_troups.findIndex(merged_troup => merged_troup.code === movement_troup.code)
      if (destination_troup_index === -1) {
        merged_troups.push(movement_troup)
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
    troups,
    explore_movement,
    start_at,
    distance
  }: {
    troups: TroupEntity[]
    explore_movement: MovementEntity
    start_at: number
    distance: number
   }): {
    base_movement: MovementEntity,
    troups: TroupEntity[]
  } {
    assert.strictEqual(explore_movement.action, MovementAction.EXPLORE)

    const duration = this.getMovementDuration({
      distance,
      troup_codes: troups.map(troup => troup.code)
    })
    const base_movement = MovementEntity.create({
      id: id(),
      player_id: troups[0].player_id,
      action: MovementAction.BASE,
      origin: explore_movement.destination,
      destination: explore_movement.origin,
      arrive_at: start_at + duration
    })

    return {
      base_movement,
      troups: this.assignToMovement({
        troups,
        movement_id: base_movement.id
      })
    }
  }

  static sortTroups({ troups } : { troups: TroupEntity[] }): TroupEntity[] {
    return troups.sort((a, b) => troup_order[a.code] - troup_order[b.code])
  }

  static getMovementDuration({
    distance,
    troup_codes
  }: {
    distance: number
    troup_codes: TroupCode[]
  }): number {
    const slowest_speed = this.getSlowestSpeed({ troup_codes })
    return distance / slowest_speed
  }

  static getSlowestSpeed({ troup_codes }: { troup_codes: TroupCode[] }): number {
    return troup_codes.reduce((acc, code) => {
      const speed = troup_base_speed[code]
      if (speed < acc) {
        return speed
      }

      return acc
    }, Infinity)
  }
}
