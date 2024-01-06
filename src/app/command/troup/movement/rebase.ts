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
import { now } from '#shared/time'

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
  troup_to_remove_ids: string[]
  movement_troups: TroupEntity[]
  movement_to_remove_id: string
  movement: MovementEntity
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
      this.repository.movement.get(movement_id)
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

    const {
      origin_troups,
      movement_troups,
      movement: rebase_movement
    } = TroupService.move({
      action: MovementAction.BASE,
      distance,
      start_at: now(),
      origin: movement.destination,
      destination: movement.origin,
      origin_troups: troups,
      troups_to_move: troups.map(t => ({
        code: t.code,
        count: t.count
      }))
    })

    const report = ReportFactory.generateUnread({
      type: ReportType.REBASE,
      movement,
      troups: movement_troups
    })

    return {
      troup_to_remove_ids: origin_troups.map(({ id }) => id),
      movement_to_remove_id: movement.id,
      movement_troups,
      movement: rebase_movement,
      report
    }
  }

  async save({
    troup_to_remove_ids,
    movement_to_remove_id,
    movement_troups,
    movement,
    report
  }: TroupRebaseCommandSave): Promise<void> {
    await Promise.all([
      ...troup_to_remove_ids.map(id => this.repository.troup.delete(id)),
      ...movement_troups.map(t => this.repository.troup.create(t)),
      this.repository.movement.delete(movement_to_remove_id),
      this.repository.movement.create(movement),
      this.repository.report.create(report)
    ])
  }
}
