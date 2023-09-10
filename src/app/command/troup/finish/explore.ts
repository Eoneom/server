import assert from 'assert'
import { GenericCommand } from '#app/command/generic'
import { MovementAction } from '#core/troup/constant'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'

interface TroupFinishExploreCommandRequest {
  player_id: string
  movement_id: string
}

export interface TroupFinishExploreCommandExec {
  player_id: string
  movement: MovementEntity
  troups: TroupEntity[]
}

interface TroupFinishExploreCommandSave {
  base_movement: MovementEntity
  explore_movement_id: string
  troup: TroupEntity
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
      movement
    ] = await Promise.all([
      this.repository.troup.listByMovement({ movement_id }),
      this.repository.movement.get(movement_id)
    ])

    return {
      troups,
      player_id,
      movement
    }
  }

  exec({
    player_id,
    troups,
    movement
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

    return {
      explore_movement_id: movement.id,
      base_movement: base_movement,
      troup: updated_troup
    }
  }

  async save({
    explore_movement_id,
    base_movement,
    troup
  }: TroupFinishExploreCommandSave): Promise<void> {
    await Promise.all([
      this.repository.movement.delete(explore_movement_id),
      this.repository.movement.create(base_movement),
      this.repository.troup.updateOne(troup)
    ])
  }
}
