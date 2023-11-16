import assert from 'assert'
import { GenericCommand } from '#app/command/generic'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'

interface TroupFinishBaseCommandRequest {
  player_id: string
  movement_id: string
}

export interface TroupFinishBaseCommandExec {
  destination_troups: TroupEntity[]
  movement: MovementEntity
  player_id: string
  movement_troups: TroupEntity[]
  destination_cell_id: string
}

interface TroupFinishBaseCommandSave {
  base_movement_id: string
  updated_troups: TroupEntity[]
  delete_troup_ids: string[]
}

export class TroupFinishBaseCommand extends GenericCommand<
  TroupFinishBaseCommandRequest,
  TroupFinishBaseCommandExec,
  TroupFinishBaseCommandSave
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
      this.repository.movement.get(movement_id),
    ])

    const destination_cell = await this.repository.cell.getCell({ coordinates: movement.destination })

    const destination_troups = await this.repository.troup.listInCell({
      cell_id: destination_cell.id,
      player_id
    })

    return {
      movement_troups,
      player_id,
      destination_troups,
      movement,
      destination_cell_id: destination_cell.id,
    }
  }

  exec({
    player_id,
    movement_troups,
    movement,
    destination_troups,
    destination_cell_id
  }: TroupFinishBaseCommandExec): TroupFinishBaseCommandSave {
    assert.strictEqual(movement.action, MovementAction.BASE)

    if (movement.player_id !== player_id) {
      throw new Error(TroupError.NOT_OWNER)
    }

    if (!movement.isArrived()) {
      throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
    }

    const { merged_troups } = TroupService.mergeTroupsInDestination({
      movement_troups,
      destination_troups,
      destination_cell_id
    })

    return {
      base_movement_id: movement.id,
      delete_troup_ids: movement_troups.map(troup => troup.id),
      updated_troups: merged_troups
    }
  }

  async save({
    base_movement_id,
    updated_troups,
    delete_troup_ids
  }: TroupFinishBaseCommandSave): Promise<void> {
    await Promise.all([
      this.repository.movement.delete(base_movement_id),
      ...delete_troup_ids.map(troup_id => this.repository.troup.delete(troup_id)),
      ...updated_troups.map(troup => this.repository.troup.updateOne(troup, { upsert: true })),
    ])
  }
}
