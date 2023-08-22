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
import { CellEntity } from '#core/world/entity'

export interface AuthSignupRequest {
  player_name: string
  city_name: string
}

interface AuthSignupExec {
  does_player_exist: boolean
  does_city_exist: boolean
  player_name: string
  city_name: string
  city_first_cell: CellEntity
}

interface AuthSignupSave {
  player: PlayerEntity
  city: CityEntity
  buildings: BuildingEntity[]
  technologies: TechnologyEntity[]
  cell: CellEntity
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
      AppService.findCityFirstCell()
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
    const cell = city_first_cell.assign({ city_id: city.id })

    return {
      player,
      city,
      buildings,
      technologies,
      cell
    }
  }

  async save({
    player,
    city,
    buildings,
    technologies,
    cell
  }: AuthSignupSave): Promise<AuthSignupResponse> {
    await Promise.all([
      this.repository.player.create(player),
      this.repository.city.create(city),
      ...buildings.map(building => this.repository.building.create(building)),
      ...technologies.map(technology => this.repository.technology.create(technology)),
      this.repository.world.updateOne(cell)
    ])

    return {
      player_id: player.id,
      city_id: city.id
    }
  }
}
