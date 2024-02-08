import { GenericCommand } from '#app/command/generic'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'
import { ExplorationEntity } from '#core/world/exploration.entity'
import { AppService } from '#app/service'
import { ReportEntity } from '#core/communication/report.entity'
import { ReportType } from '#core/communication/value/report-type'
import { ReportFactory } from '#core/communication/report.factory'

interface TroupFinishExploreCommandRequest {
  player_id: string
  movement_id: string
}

export interface TroupFinishExploreCommandExec {
  player_id: string
  exploration: ExplorationEntity
  movement: MovementEntity
  troups: TroupEntity[]
  explored_cell_ids: string[]
}

interface TroupFinishExploreCommandSave {
  base_movement: MovementEntity
  explore_movement_id: string
  troups: TroupEntity[]
  exploration: ExplorationEntity
  report: ReportEntity
}

export class TroupFinishExploreCommand extends GenericCommand<
  TroupFinishExploreCommandRequest,
  TroupFinishExploreCommandExec,
  TroupFinishExploreCommandSave
> {
  constructor() {
    super({ name: 'troup:finish:explore' })
  }

  async fetch({
    player_id,
    movement_id
  }: TroupFinishExploreCommandRequest): Promise<TroupFinishExploreCommandExec> {
    const [
      troups,
      movement,
      exploration
    ] = await Promise.all([
      this.repository.troup.listByMovement({ movement_id }),
      this.repository.movement.getById(movement_id),
      this.repository.exploration.get({ player_id }),
    ])

    const explored_cell_ids = await AppService.getExploredCellIds({ coordinates: movement.destination })

    return {
      troups,
      player_id,
      movement,
      exploration,
      explored_cell_ids
    }
  }

  exec({
    player_id,
    troups,
    exploration,
    movement,
    explored_cell_ids
  }: TroupFinishExploreCommandExec): TroupFinishExploreCommandSave {
    if (!movement.isOwnedBy(player_id)) {
      throw new Error(TroupError.MOVEMENT_NOT_OWNER)
    }

    if (!movement.isArrived()) {
      throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
    }

    const distance = WorldService.getDistance({
      origin: movement.destination,
      destination: movement.origin,
    })

    const {
      troups: updated_troups,
      base_movement
    } = TroupService.finishExploration({
      troups,
      explore_movement: movement,
      start_at: movement.arrive_at,
      distance
    })

    const updated_exploration = exploration.exploreCells(explored_cell_ids)

    const report = ReportFactory.generateUnread({
      type: ReportType.EXPLORATION,
      movement,
      troups
    })

    return {
      explore_movement_id: movement.id,
      base_movement: base_movement,
      troups: updated_troups,
      exploration: updated_exploration,
      report
    }
  }

  async save({
    explore_movement_id,
    base_movement,
    troups,
    exploration,
    report
  }: TroupFinishExploreCommandSave): Promise<void> {
    await Promise.all([
      this.repository.movement.delete(explore_movement_id),
      this.repository.movement.create(base_movement),
      ...troups.map(troup => this.repository.troup.updateOne(troup)),
      this.repository.exploration.updateOne(exploration),
      this.repository.report.create(report)
    ])
  }
}
