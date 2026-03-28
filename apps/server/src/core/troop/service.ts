import { TroopCode } from '#core/troop/constant/code'
import { MovementAction } from '#core/troop/constant/movement-action'
import { troop_order } from '#core/troop/constant/order'
import { troop_characteristics } from '#core/troop/constant/characteristic'
import { TroopEntity } from '#core/troop/entity'
import { MovementEntity } from '#core/troop/movement/entity'
import { Coordinates } from '#core/world/value/coordinates'
import { id } from '#shared/identification'
import { TroopCount } from '#core/troop/type'

export class TroopService {
  static init({
    player_id,
    cell_id
  }: {
    player_id: string
    cell_id: string
  }): TroopEntity[] {
    const troops = Object.values(TroopCode).map(code => TroopEntity.init({
      cell_id,
      player_id,
      code
    }))

    return troops
  }

  static haveEnoughTroops({
    origin_troops,
    move_troops
  }: {
    origin_troops: TroopCount[]
    move_troops: TroopCount[]
  }): boolean {
    const is_missing_troop = move_troops.some(move_troop => {
      const origin_troop = origin_troops.find(troop => troop.code === move_troop.code)
      return (origin_troop?.count ?? 0) < move_troop.count
    })

    return !is_missing_troop
  }

  static splitTroops({
    origin_troops,
    troops_to_split
  }: {
    origin_troops: TroopEntity[]
    troops_to_split: TroopCount[]
  }): {
    updated_origin_troops: TroopEntity[]
    split_troops: TroopEntity[]
  } {
    const updated_origin_troops: TroopEntity[] = []
    const split_troops: TroopEntity[] = []

    origin_troops.forEach(origin_troop => {
      const troop_to_split = troops_to_split.find(t => t.code === origin_troop.code)
      if (!troop_to_split) {
        updated_origin_troops.push(origin_troop)
        return
      }

      updated_origin_troops.push(TroopEntity.create({
        ...origin_troop,
        count: origin_troop.count - troop_to_split.count
      }))

      split_troops.push(TroopEntity.create({
        id: id(),
        code: origin_troop.code,
        player_id: origin_troop.player_id,
        cell_id: origin_troop.cell_id,
        count: troop_to_split.count,
        ongoing_recruitment: null,
        movement_id: null
      }))
    })

    return {
      updated_origin_troops,
      split_troops
    }
  }

  static mergeTroops({
    movement_troops,
    destination_troops,
  }: {
    movement_troops: TroopEntity[]
    destination_troops: TroopEntity[]
  }): TroopEntity[] {
    const merged_troops = [ ...destination_troops ]

    movement_troops.forEach(movement_troop => {
      const destination_troop_index = merged_troops.findIndex(merged_troop => merged_troop.code === movement_troop.code)
      if (destination_troop_index === -1) {
        merged_troops.push(movement_troop)
      } else {
        const merged_troop_in_destination = TroopEntity.create({
          ...merged_troops[destination_troop_index],
          count: merged_troops[destination_troop_index].count + movement_troop.count,
        })

        merged_troops[destination_troop_index] = merged_troop_in_destination
      }
    })

    return merged_troops
  }

  static mergeTroopsInCell({
    movement_troops,
    destination_troops,
    cell_id
  }: {
    movement_troops: TroopEntity[]
    destination_troops: TroopEntity[]
    cell_id: string
  }) {
    const merged_troops = this.mergeTroops({
      movement_troops,
      destination_troops
    })

    return this.assignToCell({
      troops: merged_troops,
      cell_id
    })
  }

  static createMovement({
    troops,
    start_at,
    distance,
    origin,
    destination,
    player_id,
    action
  }: {
    troops: TroopCount[]
    start_at: number
    distance: number
    origin: Coordinates
    destination: Coordinates
    player_id: string
    action: MovementAction
  }): MovementEntity {
    const duration = this.getMovementDuration({
      distance,
      troop_codes: troops.map(troop => troop.code)
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

  static sortTroops({ troops } : { troops: TroopEntity[] }): TroopEntity[] {
    return troops.sort((a, b) => this.getOrder(a.code) - this.getOrder(b.code))
  }

  static getMovementDuration({
    distance,
    troop_codes
  }: {
    distance: number
    troop_codes: TroopCode[]
  }): number {
    const slowest_speed = this.getSlowestSpeed({ troop_codes })
    return distance / slowest_speed
  }

  static getSlowestSpeed({ troop_codes }: { troop_codes: TroopCode[] }): number {
    return troop_codes.reduce((acc, code) => {
      const speed = this.getSpeed(code)
      if (speed < acc) {
        return speed
      }

      return acc
    }, Infinity)
  }

  static assignToCell({
    troops,
    cell_id
  }: {
    troops: TroopEntity[]
    cell_id: string
  }): TroopEntity[] {
    return troops.map(troop => troop.assignToCell({ cell_id }))
  }

  static assignToMovement({
    troops,
    movement_id
  }: {
    troops: TroopEntity[]
    movement_id: string
  }): TroopEntity[] {
    return troops.map(troop => troop.assignToMovement({ movement_id }))
  }

  static areTroopsEmpty({ troops }: {
    troops: TroopEntity[]
  }): boolean {
    return !troops.some(troop => troop.count)
  }

  static getTransportCapacity(code: TroopCode): number {
    return troop_characteristics[code].transport_capacity
  }

  static getSpeed(code: TroopCode): number {
    return troop_characteristics[code].speed
  }

  static getOrder(code: TroopCode): number {
    return troop_order[code]
  }
}
