import assert from 'assert'
import { GenericCommand } from '#app/command/generic'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'
import { ExplorationEntity } from '#core/world/exploration.entity'
import { AppService } from '#app/service'
import { ReportEntity } from '#core/communication/report.entity'
import { id } from '#shared/identification'
import { ReportType } from '#core/communication/value/report-type'
import { now } from '#shared/time'

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
  troup: TroupEntity
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
      this.repository.movement.get(movement_id),
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
    const is_player_movement = troups.every(troup => troup.player_id === player_id)
    if (!is_player_movement) {
      throw new Error(TroupError.NOT_OWNER)
    }

    if (!movement.isArrived()) {
      throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
    }

    assert.strictEqual(movement.action, MovementAction.EXPLORE)

    const [ troup ] = troups
    const distance = WorldService.getDistance({
      origin: movement.destination,
      destination: movement.origin,
    })

    const {
      troup: updated_troup,
      base_movement
    } = TroupService.finishExploration({
      troup,
      explore_movement: movement,
      start_at: movement.arrive_at,
      distance
    })

    const updated_exploration = exploration.exploreCells(explored_cell_ids)

    const report = ReportEntity.create({
      id: id(),
      player_id,
      type: ReportType.EXPLORATION,
      origin: movement.origin,
      destination: movement.destination,
      recorded_at: movement.arrive_at,
      troups: [
        {
          code: troup.code,
          count: troup.count
        }
      ],
    })

    return {
      explore_movement_id: movement.id,
      base_movement: base_movement,
      troup: updated_troup,
      exploration: updated_exploration,
      report
    }
  }

  async save({
    explore_movement_id,
    base_movement,
    troup,
    exploration,
    report
  }: TroupFinishExploreCommandSave): Promise<void> {
    await Promise.all([
      this.repository.movement.delete(explore_movement_id),
      this.repository.movement.create(base_movement),
      this.repository.troup.updateOne(troup),
      this.repository.exploration.updateOne(exploration),
      this.repository.report.create(report)
    ])
  }
}
