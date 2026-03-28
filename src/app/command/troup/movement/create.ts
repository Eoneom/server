import { Factory } from '#adapter/factory'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostEntity } from '#core/outpost/entity'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { TroupCount } from '#core/troup/type'
import { WorldService } from '#core/world/service'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'

export interface CreateTroupMovementParams {
  player_id: string
  origin: Coordinates
  destination: Coordinates
  action: MovementAction
  move_troups: TroupCount[]
}

export interface CreateTroupMovementResult {
  deleted_outpost_id?: string
}

export async function createTroupMovement({
  player_id,
  action,
  origin,
  destination,
  move_troups,
}: CreateTroupMovementParams): Promise<CreateTroupMovementResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:move')
  logger.info('run')

  const [ origin_cell ] = await Promise.all([
    repository.cell.getCell({ coordinates: origin }),
    repository.cell.getCell({ coordinates: destination }),
  ])

  const origin_troups = await repository.troup.listInCell({
    cell_id: origin_cell.id,
    player_id,
  })

  const outpost = await repository.outpost.searchByCell({ cell_id: origin_cell.id })

  const have_enough_troups = TroupService.haveEnoughTroups({
    origin_troups,
    move_troups,
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
    splitted_troups,
  } = TroupService.splitTroups({
    origin_troups: origin_troups,
    troups_to_split: move_troups,
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
    movement_id: movement.id,
  })

  let save: {
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

  if (outpost?.type === OutpostType.TEMPORARY && TroupService.areTroupsEmpty({ troups: updated_origin_troups })) {
    save = {
      type: 'delete',
      troups_to_create: movement_troups,
      movement_to_create: movement,
      outpost_to_delete: outpost,
      troups_to_delete: updated_origin_troups,
    }
  } else {
    save = {
      type: 'update',
      troups_to_update: updated_origin_troups,
      troups_to_create: movement_troups,
      movement_to_create: movement,
    }
  }

  const promises: Promise<void | string>[] = [
    ...save.troups_to_create.map(troup => repository.troup.create(troup)),
    repository.movement.create(save.movement_to_create),
  ]

  let deleted_outpost_id: string | undefined = undefined

  switch (save.type) {
  case 'update':
    promises.push(...save.troups_to_update.map(troup => repository.troup.updateOne(troup)))
    break

  case 'delete':
    promises.push(repository.outpost.delete(save.outpost_to_delete.id))
    promises.push(...save.troups_to_delete.map(troup => repository.troup.delete(troup.id)))
    deleted_outpost_id = save.outpost_to_delete.id
  }

  await Promise.all(promises)

  return { deleted_outpost_id }
}
