import { GenericCommand } from '#app/command/generic'
import { AppService } from '#app/service'
import { BuildingEntity } from '#core/building/entity'
import { BuildingService } from '#core/building/service'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { CityService } from '#core/city/service'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostError } from '#core/outpost/error'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupService } from '#core/troup/service'
import { CellEntity } from '#core/world/cell.entity'
import { ExplorationEntity } from '#core/world/exploration.entity'

interface CitySettleCommandRequest {
  outpost_id: string
  player_id: string
  city_name: string
}

export interface CitySettleCommandExec {
  outpost: OutpostEntity
  cell: CellEntity
  existing_cities_count: number
  player_id: string
  city_name: string
  settler_troup: TroupEntity
  does_city_exist: boolean
  exploration: ExplorationEntity
  cells_around_city: CellEntity[]
}

interface CitySettleCommandSave {
  outpost_to_delete: OutpostEntity
  city_to_create: CityEntity
  buildings_to_create: BuildingEntity[]
  settler_troup_to_update: TroupEntity
  cell_to_update: CellEntity
  exploration_to_update: ExplorationEntity
}

interface CitySettleCommandResponse {
  city_id: string
}

export class CitySettleCommand extends GenericCommand<
  CitySettleCommandRequest,
  CitySettleCommandExec,
  CitySettleCommandSave,
  CitySettleCommandResponse
> {
  constructor() {
    super({ name:'city:settle' })
  }

  async fetch({
    player_id,
    outpost_id,
    city_name
  }: CitySettleCommandRequest): Promise<CitySettleCommandExec> {
    const [
      outpost,
      existing_cities_count,
      does_city_exist,
      exploration
    ] = await Promise.all([
      this.repository.outpost.getById(outpost_id),
      this.repository.city.count({ player_id }),
      this.repository.city.exist(city_name),
      this.repository.exploration.get({ player_id })
    ])

    const cell = await this.repository.cell.getById(outpost.cell_id)

    const settler_troup = await this.repository.troup.getInCell({
      cell_id: outpost.cell_id,
      code: TroupCode.SETTLER
    })

    const cells_around_city = await AppService.getCellsAround({ coordinates: cell.coordinates })

    return {
      player_id,
      existing_cities_count,
      outpost,
      city_name,
      settler_troup,
      does_city_exist,
      cell,
      exploration,
      cells_around_city
    }
  }

  exec({
    outpost,
    player_id,
    existing_cities_count,
    city_name,
    settler_troup,
    does_city_exist,
    cell,
    exploration,
    cells_around_city
  }: CitySettleCommandExec): CitySettleCommandSave {
    if (CityService.isLimitReached(existing_cities_count)) {
      throw new Error(CityError.LIMIT_REACHED)
    }

    if (!outpost.isOwnedBy(player_id)) {
      throw new Error(OutpostError.NOT_OWNER)
    }

    if (does_city_exist) {
      throw new Error(CityError.ALREADY_EXISTS)
    }

    const have_enough_settler = TroupService.haveEnoughTroups({
      origin_troups: [ settler_troup ],
      move_troups: [
        {
          code: TroupCode.SETTLER,
          count: 1
        }
      ]
    })
    if (!have_enough_settler) {
      throw new Error(CityError.NO_SETTLER_AVAILABLE)
    }

    const city = CityEntity.initCity({
      player_id,
      name: city_name
    })

    const buildings = BuildingService.init({ city_id: city.id })

    const settler_troup_to_update = settler_troup.removeCount(1)
    const cell_to_update = cell.assign({ city_id: city.id })
    const exploration_to_update = exploration.exploreCells([
      ...cells_around_city.map(c => c.id),
      cell.id
    ])

    return {
      outpost_to_delete: outpost,
      buildings_to_create: buildings,
      city_to_create: city,
      settler_troup_to_update,
      cell_to_update,
      exploration_to_update
    }
  }

  async save({
    outpost_to_delete,
    city_to_create,
    buildings_to_create,
    settler_troup_to_update,
    cell_to_update,
    exploration_to_update
  }: CitySettleCommandSave): Promise<CitySettleCommandResponse> {
    await Promise.all([
      this.repository.outpost.delete(outpost_to_delete.id),
      this.repository.city.create(city_to_create),
      ...buildings_to_create.map(building => this.repository.building.create(building)),
      this.repository.troup.updateOne(settler_troup_to_update),
      this.repository.cell.updateOne(cell_to_update),
      this.repository.exploration.updateOne(exploration_to_update)
    ])

    return { city_id: city_to_create.id }
  }
}
