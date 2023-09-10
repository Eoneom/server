import assert from 'assert'
import { GenericCommand } from '#app/command/generic'
import { MovementAction } from '#core/troup/constant'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'

interface TroupFinishBaseCommandRequest {
  player_id: string
  movement_id: string
}

export interface TroupFinishBaseCommandExec {
  city_troups: TroupEntity[]
  movement: MovementEntity
  player_id: string
  troups: TroupEntity[]
}

interface TroupFinishBaseCommandSave {
  base_movement_id: string
  city_troups: TroupEntity[]
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
      troups,
      movement,
    ] = await Promise.all([
      this.repository.troup.listByMovement({ movement_id }),
      this.repository.movement.get(movement_id),
    ])

    const destination_cell = await this.repository.cell.getCell({ coordinates: movement.destination })
    assert.ok(destination_cell.city_id)

    const city_troups = await this.repository.troup.listInCity({ city_id: destination_cell.city_id })
    assert.ok(city_troups.length)

    return {
      troups,
      player_id,
      city_troups,
      movement,
    }
  }

  exec({
    player_id,
    troups,
    movement,
    city_troups
  }: TroupFinishBaseCommandExec): TroupFinishBaseCommandSave {
    assert.strictEqual(movement.action, MovementAction.BASE)

    const is_player_movement = troups.every(troup => troup.player_id === player_id)
    if (!is_player_movement) {
      throw new Error(TroupError.NOT_OWNER)
    }

    if (!movement.isArrived()) {
      throw new Error(TroupError.MOVEMENT_NOT_ARRIVED)
    }

    const { city_troups: updated_troups } = TroupService.finishBaseInCity({
      troups,
      city_troups
    })

    return {
      base_movement_id: movement.id,
      delete_troup_ids: troups.map(troup => troup.id),
      city_troups: updated_troups
    }
  }

  async save({
    base_movement_id,
    city_troups,
    delete_troup_ids
  }: TroupFinishBaseCommandSave): Promise<void> {
    await Promise.all([
      this.repository.movement.delete(base_movement_id),
      ...delete_troup_ids.map(troup_id => this.repository.troup.delete(troup_id)),
      ...city_troups.map(troup => this.repository.troup.updateOne(troup)),
    ])
  }
}
