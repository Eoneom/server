import { Factory } from '#adapter/factory'
import { ReportFactory } from '#core/communication/report.factory'
import { ReportType } from '#core/communication/value/report-type'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'

export interface RebaseTroupMovementParams {
  player_id: string
  movement_id: string
}

export async function rebaseTroupMovement({
  movement_id,
  player_id,
}: RebaseTroupMovementParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:troup:rebase')
  logger.info('run')

  const movement = await repository.movement.getById(movement_id)

  if (!movement.isOwnedBy(player_id)) {
    throw new Error(TroupError.NOT_OWNER)
  }

  const troups = await repository.troup.listByMovement({ movement_id })

  const distance = WorldService.getDistance({
    origin: movement.destination,
    destination: movement.origin,
  })

  const rebase_movement = TroupService.createMovement({
    action: MovementAction.BASE,
    destination: movement.origin,
    distance,
    origin: movement.destination,
    player_id,
    start_at: movement.arrive_at,
    troups,
  })

  const rebase_troups = TroupService.assignToMovement({
    troups,
    movement_id: movement.id,
  })

  const report = ReportFactory.generateUnread({
    type: ReportType.REBASE,
    movement,
    troups,
  })

  await Promise.all([
    ...rebase_troups.map(t => repository.troup.updateOne(t)),
    repository.movement.delete(movement.id),
    repository.movement.create(rebase_movement),
    repository.report.create(report),
  ])
}
