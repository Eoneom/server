import { GenericCommand } from '#app/command/generic'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostEntity } from '#core/outpost/entity'
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

interface TroupCreateMovementCommandRequest {
  player_id: string
  origin: Coordinates
  destination: Coordinates
  action: MovementAction
  move_troups: TroupCount[]
}

export interface TroupCreateMovementCommandExec {
  player_id: string
  origin: Coordinates
  destination: Coordinates
  action: MovementAction
  origin_troups: TroupEntity[]
  move_troups: {
    code: TroupCode,
    count: number
  }[]
  outpost: OutpostEntity | null
}

interface TroupCreateMovementCommandResponse {
  deleted_outpost_id?: string
}

type TroupCreateMovementCommandSave = {
  troups_to_create: TroupEntity[]
  movement_to_create: MovementEntity
} & ({
  type: 'update'
  troups_to_update: TroupEntity[]
} | {
  type: 'delete'
  outpost_to_delete: OutpostEntity
  troups_to_delete: TroupEntity[]
})

export class TroupCreateMovementCommand extends GenericCommand<
  TroupCreateMovementCommandRequest,
  TroupCreateMovementCommandExec,
  TroupCreateMovementCommandSave,
  TroupCreateMovementCommandResponse
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
  }: TroupCreateMovementCommandRequest): Promise<TroupCreateMovementCommandExec> {
    const [ origin_cell ] = await Promise.all([
      this.repository.cell.getCell({ coordinates: origin }),
      this.repository.cell.getCell({ coordinates: destination })
    ])

    const origin_troups = await this.repository.troup.listInCell({
      cell_id: origin_cell.id,
      player_id
    })

    const outpost = await this.repository.outpost.searchByCell({ cell_id: origin_cell.id })

    return {
      player_id,
      action,
      origin,
      destination,
      origin_troups,
      move_troups,
      outpost
    }
  }

  exec({
    origin_troups,
    move_troups,
    player_id,
    action,
    origin,
    destination,
    outpost
  }: TroupCreateMovementCommandExec): TroupCreateMovementCommandSave {
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

    const {
      updated_origin_troups,
      splitted_troups
    } = TroupService.splitTroups({
      origin_troups: origin_troups,
      troups_to_split: move_troups
    })

    const movement = TroupService.createMovement({
      player_id,
      origin,
      destination,
      action,
      distance,
      troups: splitted_troups,
      start_at: now(),
    })

    const movement_troups = TroupService.assignToMovement({
      troups: splitted_troups,
      movement_id: movement.id
    })

    if (outpost?.type === OutpostType.TEMPORARY && TroupService.areTroupsEmpty({ troups: updated_origin_troups })) {
      return {
        type: 'delete',
        troups_to_create: movement_troups,
        movement_to_create: movement,
        outpost_to_delete: outpost,
        troups_to_delete: updated_origin_troups
      }
    }

    return {
      type: 'update',
      troups_to_update: updated_origin_troups,
      troups_to_create: movement_troups,
      movement_to_create: movement
    }
  }

  async save({
    troups_to_create,
    movement_to_create,
    ...params
  }: TroupCreateMovementCommandSave): Promise<TroupCreateMovementCommandResponse> {
    const promises: Promise<void | string>[] = [
      ...troups_to_create.map(troup => this.repository.troup.create(troup)),
      this.repository.movement.create(movement_to_create),
    ]

    let deleted_outpost_id: string | undefined = undefined

    switch (params.type) {
    case 'update':
      promises.push(...params.troups_to_update.map(troup => this.repository.troup.updateOne(troup)))
      break

    case 'delete':
      promises.push(this.repository.outpost.delete(params.outpost_to_delete.id))
      promises.push(...params.troups_to_delete.map(troup => this.repository.troup.delete(troup.id)))
      deleted_outpost_id = params.outpost_to_delete.id
    }

    await Promise.all(promises)

    return { deleted_outpost_id }
  }
}
