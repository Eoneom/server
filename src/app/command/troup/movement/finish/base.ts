import assert from 'assert'
import { GenericCommand } from '#app/command/generic'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { ReportEntity } from '#core/communication/report.entity'
import { id } from '#shared/identification'
import { ReportType } from '#core/communication/value/report-type'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostService } from '#core/outpost/service'
import { OutpostError } from '#core/outpost/error'
import { ReportFactory } from '#core/communication/report.factory'

interface TroupFinishBaseCommandRequest {
  player_id: string
  movement_id: string
}

export interface TroupFinishBaseCommandExec {
  existing_destination_troups: TroupEntity[]
  movement: MovementEntity
  player_id: string
  movement_troups: TroupEntity[]
  destination_cell_id: string
  city_exists: boolean
  outpost_exists: boolean
  existing_outposts_count: number
}

interface TroupFinishBaseCommandSave {
  base_movement_id: string
  updated_troups: TroupEntity[]
  delete_troup_ids: string[]
  report: ReportEntity
  outpost: OutpostEntity | null
}

interface TroupFinishBaseCommandResponse {
  is_outpost_created: boolean
}

export class TroupFinishBaseCommand extends GenericCommand<
  TroupFinishBaseCommandRequest,
  TroupFinishBaseCommandExec,
  TroupFinishBaseCommandSave,
  TroupFinishBaseCommandResponse
> {
  constructor() {
    super({ name: 'troup:finish:base' })
  }

  async fetch({
    player_id,
    movement_id
  }: TroupFinishBaseCommandRequest): Promise<TroupFinishBaseCommandExec> {
    const [
      movement_troups,
      movement,
    ] = await Promise.all([
      this.repository.troup.listByMovement({ movement_id }),
      this.repository.movement.getById(movement_id),
    ])

    const destination_cell = await this.repository.cell.getCell({ coordinates: movement.destination })

    const existing_destination_troups = await this.repository.troup.listInCell({
      cell_id: destination_cell.id,
      player_id
    })

    const city_exists = Boolean(destination_cell.city_id)
    const outpost_exists = await this.repository.outpost.existsOnCell({ cell_id: destination_cell.id })
    const existing_outposts_count = await this.repository.outpost.countForPlayer({ player_id })

    return {
      movement_troups,
      player_id,
      existing_destination_troups,
      movement,
      destination_cell_id: destination_cell.id,
      city_exists,
      outpost_exists,
      existing_outposts_count
    }
  }

  exec({
    player_id,
    movement_troups,
    movement,
    existing_destination_troups,
    destination_cell_id,
    city_exists,
    outpost_exists,
    existing_outposts_count
  }: TroupFinishBaseCommandExec): TroupFinishBaseCommandSave {
    assert.strictEqual(movement.action, MovementAction.BASE)

    if (movement.player_id !== player_id) {
      throw new Error(TroupError.NOT_OWNER)
    }

    if (!movement.isArrived()) {
      throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
    }

    const should_build_temporary_outpost = OutpostService.shouldBuildTemporaryOutpost({
      city_exists,
      outpost_exists
    })
    const is_limit_reached = OutpostService.isLimitReached({ existing_outposts_count })
    if (should_build_temporary_outpost && is_limit_reached) {
      throw new Error(OutpostError.LIMIT_REACHED)
    }

    const destination_troups = should_build_temporary_outpost ? TroupService.init({
      player_id,
      cell_id: destination_cell_id
    }) : existing_destination_troups

    const merged_troups = TroupService.mergeTroups({
      movement_troups,
      destination_troups
    })

    const assigned_troups = TroupService.assignToCell({
      troups: merged_troups,
      cell_id: destination_cell_id
    })

    const report = ReportFactory.generateUnread({
      type: ReportType.BASE,
      movement,
      troups: movement_troups
    })

    const outpost = should_build_temporary_outpost ? OutpostEntity.create({
      id: id(),
      player_id,
      cell_id: destination_cell_id,
      type: OutpostType.TEMPORARY
    }) : null

    return {
      base_movement_id: movement.id,
      delete_troup_ids: movement_troups.map(troup => troup.id),
      updated_troups: assigned_troups,
      report,
      outpost
    }
  }

  async save({
    base_movement_id,
    updated_troups,
    delete_troup_ids,
    report,
    outpost
  }: TroupFinishBaseCommandSave): Promise<TroupFinishBaseCommandResponse> {
    await Promise.all([
      outpost && this.repository.outpost.create(outpost),
      this.repository.report.create(report),
      this.repository.movement.delete(base_movement_id),
      ...updated_troups.map(troup => this.repository.troup.updateOne(troup, { upsert: true })),
      ...delete_troup_ids.map(troup_id => this.repository.troup.delete(troup_id)),
    ])

    return { is_outpost_created: Boolean(outpost) }
  }
}
