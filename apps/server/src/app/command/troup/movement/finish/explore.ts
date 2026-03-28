import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { ReportFactory } from '#core/communication/report.factory'
import { ReportType } from '#core/communication/value/report-type'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'

export interface FinishTroupExploreMovementParams {
  player_id: string
  movement_id: string
}

export interface FinishTroupExploreMovementResult {
  base_movement: MovementEntity
}

export async function finishTroupExploreMovement({
  player_id,
  movement_id,
}: FinishTroupExploreMovementParams): Promise<FinishTroupExploreMovementResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:finish:explore')
  logger.info('run')

  const movement = await repository.movement.getById(movement_id)

  if (!movement.isOwnedBy(player_id)) {
    throw new Error(TroupError.MOVEMENT_NOT_OWNER)
  }

  if (!movement.isArrived()) {
    throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
  }

  const [
    troups,
    exploration,
    explored_cell_ids 
  ] = await Promise.all([
    repository.troup.listByMovement({ movement_id }),
    repository.exploration.get({ player_id }),
    AppService.getExploredCellIds({ coordinates: movement.destination }),
  ])

  const distance = WorldService.getDistance({
    origin: movement.destination,
    destination: movement.origin,
  })

  const base_movement = TroupService.createMovement({
    troups,
    start_at: movement.arrive_at,
    distance,
    origin: movement.destination,
    destination: movement.origin,
    player_id,
    action: MovementAction.BASE,
  })

  const base_troups = TroupService.assignToMovement({
    troups,
    movement_id: base_movement.id,
  })

  const updated_exploration = exploration.exploreCells(explored_cell_ids)

  const report = ReportFactory.generateUnread({
    type: ReportType.EXPLORATION,
    movement,
    troups,
  })

  await Promise.all([
    repository.movement.delete(movement.id),
    repository.movement.create(base_movement),
    ...base_troups.map(troup => repository.troup.updateOne(troup)),
    repository.exploration.updateOne(updated_exploration),
    repository.report.create(report),
  ])

  return { base_movement }
}
