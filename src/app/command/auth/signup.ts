import { AppService } from '#app/service'
import { GenericCommand } from '#command/generic'
import { BuildingEntity } from '#core/building/entity'
import { BuildingService } from '#core/building/service'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { PlayerEntity } from '#core/player/entity'
import { PlayerService } from '#core/player/service'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyService } from '#core/technology/service'
import { TroupEntity } from '#core/troup/entity'
import { TroupService } from '#core/troup/service'
import { CellEntity } from '#core/world/cell.entity'
import { ExplorationEntity } from '#core/world/exploration.entity'

export interface AuthSignupRequest {
  city_name: string
  player_name: string
}

export interface AuthSignupExec {
  city_first_cell: CellEntity
  cells_around_city: CellEntity[]
  city_name: string
  does_city_exist: boolean
  does_player_exist: boolean
  player_name: string
}

interface AuthSignupSave {
  buildings: BuildingEntity[]
  cell: CellEntity
  city: CityEntity
  exploration: ExplorationEntity
  player: PlayerEntity
  technologies: TechnologyEntity[]
  troups: TroupEntity[]
}

export interface AuthSignupResponse {
  player_id: string
  city_id: string
}

export class AuthSignupCommand extends GenericCommand<
  AuthSignupRequest,
  AuthSignupExec,
  AuthSignupSave,
  AuthSignupResponse
> {
  constructor() {
    super({ name: 'auth:signup' })
  }

  async fetch({
    player_name,
    city_name
  }: AuthSignupRequest): Promise<AuthSignupExec> {
    const [
      does_player_exist,
      does_city_exist,
      city_first_cell,
    ] = await Promise.all([
      this.repository.player.exist(player_name),
      this.repository.city.exist(city_name),
      AppService.selectCityFirstCell(),
    ])

    const cells_around_city = await AppService.getCellsAround({ coordinates: city_first_cell.coordinates })

    return {
      cells_around_city,
      city_first_cell,
      city_name,
      does_city_exist,
      does_player_exist,
      player_name,
    }
  }

  exec({
    does_city_exist,
    does_player_exist,
    player_name,
    city_name,
    city_first_cell,
    cells_around_city
  }: AuthSignupExec): AuthSignupSave {
    const player = PlayerService.init({
      name: player_name,
      does_player_exist
    })
    const city = CityService.settle({
      name: city_name,
      player_id: player.id,
      does_city_exist
    })
    const buildings = BuildingService.init({ city_id: city.id })
    const technologies = TechnologyService.init({ player_id: player.id })
    const cell = city_first_cell.assign({ city_id: city.id })
    const troups = TroupService.init({
      player_id: player.id,
      cell_id: cell.id
    })
    const exploration = ExplorationEntity.init({
      player_id: player.id,
      cell_ids: [
        ...cells_around_city.map(c => c.id),
        cell.id
      ]
    })

    return {
      player,
      city,
      buildings,
      technologies,
      cell,
      troups,
      exploration
    }
  }

  async save({
    buildings,
    cell,
    city,
    exploration,
    player,
    technologies,
    troups,
  }: AuthSignupSave): Promise<AuthSignupResponse> {
    await Promise.all([
      this.repository.player.create(player),
      this.repository.city.create(city),
      ...buildings.map(building => this.repository.building.create(building)),
      ...technologies.map(technology => this.repository.technology.create(technology)),
      this.repository.cell.updateOne(cell),
      ...troups.map(troup => this.repository.troup.create(troup)),
      this.repository.exploration.create(exploration)
    ])

    return {
      player_id: player.id,
      city_id: city.id
    }
  }
}
