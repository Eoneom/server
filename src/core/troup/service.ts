import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { troup_order } from '#core/troup/constant/order'
import { troup_characteristics } from '#core/troup/constant/characteristic'
import { TroupEntity } from '#core/troup/entity'
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

  static splitTroups({
    origin_troups,
    troups_to_split
  }: {
    origin_troups: TroupEntity[]
    troups_to_split: TroupCount[]
  }): {
    updated_origin_troups: TroupEntity[]
    splitted_troups: TroupEntity[]
  } {
    const updated_origin_troups: TroupEntity[] = []
    const splitted_troups: TroupEntity[] = []

    origin_troups.forEach(origin_troup => {
      const troup_to_split = troups_to_split.find(t => t.code === origin_troup.code)
      if (!troup_to_split) {
        updated_origin_troups.push(origin_troup)
        return
      }

      updated_origin_troups.push(TroupEntity.create({
        ...origin_troup,
        count: origin_troup.count - troup_to_split.count
      }))

      splitted_troups.push(TroupEntity.create({
        id: id(),
        code: origin_troup.code,
        player_id: origin_troup.player_id,
        cell_id: origin_troup.cell_id,
        count: troup_to_split.count,
        ongoing_recruitment: null,
        movement_id: null
      }))
    })

    return {
      updated_origin_troups,
      splitted_troups
    }
  }

  static mergeTroups({
    movement_troups,
    destination_troups,
  }: {
    movement_troups: TroupEntity[]
    destination_troups: TroupEntity[]
  }): TroupEntity[] {
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

    return merged_troups
  }

  static mergeTroupsInCell({
    movement_troups,
    destination_troups,
    cell_id
  }: {
    movement_troups: TroupEntity[]
    destination_troups: TroupEntity[]
    cell_id: string
  }) {
    const merged_troups = this.mergeTroups({
      movement_troups,
      destination_troups
    })

    return this.assignToCell({
      troups: merged_troups,
      cell_id
    })
  }

  static createMovement({
    troups,
    start_at,
    distance,
    origin,
    destination,
    player_id,
    action
  }: {
    troups: TroupCount[]
    start_at: number
    distance: number
    origin: Coordinates
    destination: Coordinates
    player_id: string
    action: MovementAction
  }): MovementEntity {
    const duration = this.getMovementDuration({
      distance,
      troup_codes: troups.map(troup => troup.code)
    })

    return MovementEntity.create({
      id: id(),
      player_id,
      action,
      origin,
      destination,
      arrive_at: start_at + duration
    })
  }

  static sortTroups({ troups } : { troups: TroupEntity[] }): TroupEntity[] {
    return troups.sort((a, b) => this.getOrder(a.code) - this.getOrder(b.code))
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
      const speed = this.getSpeed(code)
      if (speed < acc) {
        return speed
      }

      return acc
    }, Infinity)
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

  static areTroupsEmpty({ troups }: {
    troups: TroupEntity[]
  }): boolean {
    return !troups.some(troup => troup.count)
  }

  static getTransportCapacity(code: TroupCode): number {
    return troup_characteristics[code].transport_capacity
  }

  static getSpeed(code: TroupCode): number {
    return troup_characteristics[code].speed
  }

  static getOrder(code: TroupCode): number {
    return troup_order[code]
  }
}
