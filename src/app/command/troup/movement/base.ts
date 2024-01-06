import { GenericCommand } from '#app/command/generic'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { WorldService } from '#core/world/service'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'

interface TroupBaseCommandRequest {
  player_id: string
  origin: Coordinates
  destination: Coordinates
  troups_to_move: {
    code: TroupCode
    count: number
  }[]
}

export interface TroupBaseCommandExec {
  origin: Coordinates
  destination: Coordinates
  origin_troups: TroupEntity[]
  troups_to_move: {
    code: TroupCode
    count: number
  }[]
}

interface TroupBaseCommandSave {
  origin_troups: TroupEntity[],
  movement_troups: TroupEntity[],
  movement: MovementEntity
}

export class TroupBaseCommand extends GenericCommand<
  TroupBaseCommandRequest,
  TroupBaseCommandExec,
  TroupBaseCommandSave
> {
  constructor() {
    super({ name: 'troup:base' })
  }

  async fetch({
    player_id,
    origin,
    destination,
    troups_to_move
  }: TroupBaseCommandRequest): Promise<TroupBaseCommandExec> {
    const origin_cell = await this.repository.cell.getCell({ coordinates: origin })
    const origin_troups = await this.repository.troup.listInCell({
      cell_id: origin_cell.id,
      player_id
    })

    return {
      origin,
      destination,
      origin_troups,
      troups_to_move
    }
  }

  exec({
    origin,
    destination,
    origin_troups,
    troups_to_move
  }: TroupBaseCommandExec): TroupBaseCommandSave {
    const distance = WorldService.getDistance({
      origin,
      destination,
    })

    return TroupService.move({
      action: MovementAction.BASE,
      distance,
      start_at: now(),
      origin,
      destination,
      origin_troups,
      troups_to_move,
    })
  }

  async save({
    origin_troups,
    movement_troups,
    movement
  }: TroupBaseCommandSave): Promise<void> {
    await Promise.all([
      ...origin_troups.map(origin_troup => this.repository.troup.updateOne(origin_troup)),
      ...movement_troups.map(movement_troup => this.repository.troup.create(movement_troup)),
      this.repository.movement.create(movement)
    ])
  }
}
