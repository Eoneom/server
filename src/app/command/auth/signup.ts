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

export interface AuthSignupRequest {
  city_name: string
  player_name: string
}

export interface AuthSignupExec {
  city_first_cell: CellEntity
  city_name: string
  does_city_exist: boolean
  does_player_exist: boolean
  player_name: string
}

interface AuthSignupSave {
  buildings: BuildingEntity[]
  cell: CellEntity
  city: CityEntity
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
      city_first_cell
    ] = await Promise.all([
      this.repository.player.exist(player_name),
      this.repository.city.exist(city_name),
      AppService.selectCityFirstCell()
    ])

    return {
      does_city_exist,
      does_player_exist,
      player_name,
      city_name,
      city_first_cell
    }
  }

  exec({
    does_city_exist,
    does_player_exist,
    player_name,
    city_name,
    city_first_cell
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
    const troups = TroupService.init({
      player_id: player.id,
      city_id: city.id
    })
    const cell = city_first_cell.assign({ city_id: city.id })

    return {
      player,
      city,
      buildings,
      technologies,
      cell,
      troups
    }
  }

  async save({
    player,
    city,
    buildings,
    technologies,
    cell,
    troups
  }: AuthSignupSave): Promise<AuthSignupResponse> {
    await Promise.all([
      this.repository.player.create(player),
      this.repository.city.create(city),
      ...buildings.map(building => this.repository.building.create(building)),
      ...technologies.map(technology => this.repository.technology.create(technology)),
      this.repository.cell.updateOne(cell),
      ...troups.map(troup => this.repository.troup.create(troup))
    ])

    return {
      player_id: player.id,
      city_id: city.id
    }
  }
}
