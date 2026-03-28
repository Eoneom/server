import assert from 'assert'
import { Factory } from '#adapter/factory'
import { ReportEntity } from '#core/communication/report.entity'
import { ReportFactory } from '#core/communication/report.factory'
import { ReportType } from '#core/communication/value/report-type'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostService } from '#core/outpost/service'
import { OutpostError } from '#core/outpost/error'
import { id } from '#shared/identification'

export interface FinishTroupBaseMovementParams {
  player_id: string
  movement_id: string
}

export interface FinishTroupBaseMovementResult {
  is_outpost_created: boolean
}

interface FinishBaseSave {
  delete_movement_id: string
  updated_troups: TroupEntity[]
  delete_troup_ids: string[]
  report: ReportEntity
  outpost?: OutpostEntity
}

function finishBaseMovementInLocation({
  movement,
  movement_troups,
  destination_cell_id,
  existing_destination_troups,
}: {
  movement: MovementEntity
  movement_troups: TroupEntity[]
  existing_destination_troups: TroupEntity[]
  destination_cell_id: string
}): FinishBaseSave {
  const updated_troups = TroupService.mergeTroupsInCell({
    movement_troups,
    destination_troups: existing_destination_troups,
    cell_id: destination_cell_id,
  })

  const report = ReportFactory.generateUnread({
    type: ReportType.BASE,
    movement,
    troups: movement_troups,
  })

  return {
    delete_movement_id: movement.id,
    delete_troup_ids: movement_troups.map(troup => troup.id),
    updated_troups,
    report,
  }
}

function finishBaseMovementInTemporaryOutpost({
  destination_cell_id,
  movement,
  existing_outposts_count,
  player_id,
  movement_troups,
}: {
  destination_cell_id: string
  movement: MovementEntity
  existing_outposts_count: number
  player_id: string
  movement_troups: TroupEntity[]
}): FinishBaseSave {
  const is_limit_reached = OutpostService.isLimitReached({ existing_outposts_count })
  if (is_limit_reached) {
    throw new Error(OutpostError.LIMIT_REACHED)
  }

  const destination_troups = TroupService.init({
    player_id,
    cell_id: destination_cell_id,
  })

  const updated_troups = TroupService.mergeTroupsInCell({
    movement_troups,
    destination_troups,
    cell_id: destination_cell_id,
  })

  const report = ReportFactory.generateUnread({
    type: ReportType.BASE,
    movement,
    troups: movement_troups,
  })

  const outpost = OutpostEntity.create({
    id: id(),
    player_id,
    cell_id: destination_cell_id,
    type: OutpostType.TEMPORARY,
  })

  return {
    delete_movement_id: movement.id,
    delete_troup_ids: movement_troups.map(troup => troup.id),
    updated_troups,
    report,
    outpost,
  }
}

export async function finishTroupBaseMovement({
  player_id,
  movement_id,
}: FinishTroupBaseMovementParams): Promise<FinishTroupBaseMovementResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:finish:base')
  logger.info('run')

  const movement = await repository.movement.getById(movement_id)

  assert.strictEqual(movement.action, MovementAction.BASE)

  if (movement.player_id !== player_id) {
    throw new Error(TroupError.NOT_OWNER)
  }

  if (!movement.isArrived()) {
    throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
  }

  const destination_cell = await repository.cell.getCell({ coordinates: movement.destination })

  const city_exists = Boolean(destination_cell.city_id)
  const outpost_exists = await repository.outpost.existsOnCell({ cell_id: destination_cell.id })
  const does_location_exist = city_exists || outpost_exists

  let finish_save: FinishBaseSave
  if (does_location_exist) {
    const [
      movement_troups,
      existing_destination_troups 
    ] = await Promise.all([
      repository.troup.listByMovement({ movement_id }),
      repository.troup.listInCell({
        cell_id: destination_cell.id,
        player_id,
      }),
    ])
    finish_save = finishBaseMovementInLocation({
      movement,
      movement_troups,
      destination_cell_id: destination_cell.id,
      existing_destination_troups,
    })
  } else {
    const [
      movement_troups,
      existing_outposts_count 
    ] = await Promise.all([
      repository.troup.listByMovement({ movement_id }),
      repository.outpost.countForPlayer({ player_id }),
    ])
    finish_save = finishBaseMovementInTemporaryOutpost({
      destination_cell_id: destination_cell.id,
      movement,
      existing_outposts_count,
      movement_troups,
      player_id,
    })
  }

  await Promise.all([
    finish_save.outpost && repository.outpost.create(finish_save.outpost),
    repository.report.create(finish_save.report),
    repository.movement.delete(finish_save.delete_movement_id),
    ...finish_save.updated_troups.map(troup => repository.troup.updateOne(troup, { upsert: true })),
    ...finish_save.delete_troup_ids.map(troup_id => repository.troup.delete(troup_id)),
  ])

  return { is_outpost_created: Boolean(finish_save.outpost) }
}
