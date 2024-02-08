import { GenericCommand } from '#app/command/generic'
import { ReportEntity } from '#core/communication/report.entity'
import { ReportFactory } from '#core/communication/report.factory'
import { ReportType } from '#core/communication/value/report-type'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'

interface TroupRebaseCommandRequest {
  player_id: string
  movement_id: string
}

export interface TroupRebaseCommandExec {
  movement: MovementEntity
  troups: TroupEntity[]
  player_id: string
}

interface TroupRebaseCommandSave {
  troups_to_update: TroupEntity[]
  movement_to_remove: MovementEntity
  movement_to_create: MovementEntity
  report: ReportEntity
}

export class TroupRebaseCommand extends GenericCommand<
  TroupRebaseCommandRequest,
  TroupRebaseCommandExec,
  TroupRebaseCommandSave
> {

  constructor() {
    super({ name: 'troup:rebase' })
  }

  async fetch({
    movement_id,
    player_id
  }: TroupRebaseCommandRequest): Promise<TroupRebaseCommandExec> {
    const [
      troups,
      movement
    ] = await Promise.all([
      this.repository.troup.listByMovement({ movement_id }),
      this.repository.movement.getById(movement_id)
    ])

    return {
      troups,
      movement,
      player_id
    }
  }

  exec({
    troups,
    movement,
    player_id
  }: TroupRebaseCommandExec): TroupRebaseCommandSave {
    if (!movement.isOwnedBy(player_id)) {
      throw new Error(TroupError.NOT_OWNER)
    }
    const distance = WorldService.getDistance({
      origin: movement.destination,
      destination: movement.origin
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
      movement_id: movement.id
    })

    const report = ReportFactory.generateUnread({
      type: ReportType.REBASE,
      movement,
      troups
    })

    return {
      report,
      movement_to_remove: movement,
      movement_to_create: rebase_movement,
      troups_to_update: rebase_troups,
    }
  }

  async save({
    movement_to_remove,
    troups_to_update,
    movement_to_create,
    report
  }: TroupRebaseCommandSave): Promise<void> {
    await Promise.all([
      ...troups_to_update.map(t => this.repository.troup.updateOne(t)),
      this.repository.movement.delete(movement_to_remove.id),
      this.repository.movement.create(movement_to_create),
      this.repository.report.create(report)
    ])
  }
}
