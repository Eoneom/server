import { GenericCommand } from '#app/command/generic'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { TroupCount } from '#core/troup/type'
import { WorldService } from '#core/world/service'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'

interface TroupMoveCommandRequest {
  player_id: string
  origin: Coordinates
  destination: Coordinates
  action: MovementAction
  move_troups: TroupCount[]
}

export interface TroupMoveCommandExec {
  player_id: string
  origin: Coordinates
  destination: Coordinates
  action: MovementAction
  origin_troups: TroupEntity[]
  move_troups: {
    code: TroupCode,
    count: number
  }[]
}

interface TroupMoveCommandSave {
  troups_to_update: TroupEntity[]
  troups_to_create: TroupEntity[]
  movement_to_create: MovementEntity
}

export class TroupMoveCommand extends GenericCommand<
  TroupMoveCommandRequest,
  TroupMoveCommandExec,
  TroupMoveCommandSave
> {
  constructor() {
    super({ name: 'troup:move' })
  }

  async fetch({
    player_id,
    action,
    origin,
    destination,
    move_troups
  }: TroupMoveCommandRequest): Promise<TroupMoveCommandExec> {
    const [ origin_cell ] = await Promise.all([
      this.repository.cell.getCell({ coordinates: origin }),
      this.repository.cell.getCell({ coordinates: destination })
    ])

    const origin_troups = await this.repository.troup.listInCell({
      cell_id: origin_cell.id,
      player_id
    })

    return {
      player_id,
      action,
      origin,
      destination,
      origin_troups,
      move_troups
    }
  }

  exec({
    origin_troups,
    move_troups,
    player_id,
    action,
    origin,
    destination
  }: TroupMoveCommandExec): TroupMoveCommandSave {
    const have_enough_troups = TroupService.haveEnoughTroups({
      origin_troups,
      move_troups
    })
    if (!have_enough_troups) {
      throw new Error(TroupError.NOT_ENOUGH_TROUPS)
    }

    const distance = WorldService.getDistance({
      origin,
      destination,
    })

    const new_origin_troups = TroupService.removeTroups({
      origin_troups,
      remove_troups: move_troups
    })

    const {
      movement,
      troups: movement_troups
    } = TroupService.createMovementWithTroups({
      player_id,
      move_troups,
      action,
      distance,
      origin,
      destination,
      start_at: now()
    })

    return {
      troups_to_update: new_origin_troups,
      troups_to_create: movement_troups,
      movement_to_create: movement
    }
  }

  async save({
    troups_to_create,
    troups_to_update,
    movement_to_create
  }: TroupMoveCommandSave): Promise<void> {
    await Promise.all([
      ...troups_to_create.map(troup => this.repository.troup.create(troup)),
      ...troups_to_update.map(troup => this.repository.troup.updateOne(troup)),
      this.repository.movement.create(movement_to_create)
    ])
  }
}
