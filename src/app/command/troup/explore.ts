import { GenericCommand } from '#app/command/generic'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import {
  MovementAction,
  TroupCode
} from '#core/troup/constant'
import { TroupEntity } from '#core/troup/entity'
import { MovementEntity } from '#core/troup/movement.entity'
import { TroupService } from '#core/troup/service'
import { CellEntity } from '#core/world/cell.entity'
import { WorldService } from '#core/world/service'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'

interface TroupExploreCommandRequest {
  city_id: string,
  player_id: string
  coordinates: Coordinates
}

export interface TroupExploreCommandExec {
  cell_to_explore: CellEntity
  city_explorer_troup: TroupEntity
  city: CityEntity
  city_cell: CellEntity
  player_id: string
}

interface TroupExploreCommandSave {
  city_troup: TroupEntity
  movement_troup: TroupEntity
  movement: MovementEntity
}

export class TroupExploreCommand extends GenericCommand<
  TroupExploreCommandRequest,
  TroupExploreCommandExec,
  TroupExploreCommandSave
> {
  constructor() {
    super({ name: 'troup:explore' })
  }

  async fetch({
    city_id,
    player_id,
    coordinates
  }: TroupExploreCommandRequest): Promise<TroupExploreCommandExec> {
    const [
      city,
      city_cell,
      cell_to_explore,
      city_explorer_troup
    ] = await Promise.all([
      this.repository.city.get(city_id),
      this.repository.cell.getCityCell({ city_id }),
      this.repository.cell.getCell({ coordinates }),
      this.repository.troup.getInCity({
        city_id,
        code: TroupCode.EXPLORER
      })
    ])

    return {
      cell_to_explore,
      city_explorer_troup,
      city,
      city_cell,
      player_id
    }
  }

  exec({
    cell_to_explore,
    city,
    city_cell,
    city_explorer_troup,
    player_id
  }: TroupExploreCommandExec): TroupExploreCommandSave {
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const distance = WorldService.getDistance({
      origin: city_cell.coordinates,
      destination: cell_to_explore.coordinates,
    })

    return TroupService.move({
      action: MovementAction.EXPLORE,
      troup: city_explorer_troup,
      origin: city_cell.coordinates,
      destination: cell_to_explore.coordinates,
      count_to_move: 1,
      distance,
      start_at: now(),
    })
  }

  async save({
    city_troup,
    movement_troup,
    movement
  }: TroupExploreCommandSave): Promise<void> {
    await Promise.all([
      this.repository.troup.updateOne(city_troup),
      this.repository.troup.create(movement_troup),
      this.repository.movement.create(movement)
    ])
  }
}
