import { GenericCommand } from '#app/command/generic'
import { BuildingEntity } from '#core/building/entity'
import { BuildingService } from '#core/building/service'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { PlayerEntity } from '#core/player/entity'
import { PlayerService } from '#core/player/service'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyService } from '#core/technology/service'

export interface SignupRequest {
  player_name: string
  city_name: string
}

interface SignupExec {
  does_player_exist: boolean
  does_city_exist: boolean
  player_name: string
  city_name: string
}

interface SignupSave {
  player: PlayerEntity
  city: CityEntity
  buildings: BuildingEntity[]
  technologies: TechnologyEntity[]
}

export interface SignupResponse {
  player_id: string
  city_id: string
}

export class SignupCommand extends GenericCommand<
  SignupRequest,
  SignupExec,
  SignupSave,
  SignupResponse
> {
  async fetch({
    player_name,
    city_name
  }: SignupRequest): Promise<SignupExec> {
    const [
      does_player_exist,
      does_city_exist
    ] = await Promise.all([
      this.repository.player.exist(player_name),
      this.repository.city.exist(city_name)
    ])

    return {
      does_city_exist,
      does_player_exist,
      player_name,
      city_name
    }
  }
  exec({
    does_city_exist,
    does_player_exist,
    player_name,
    city_name
  }: SignupExec): SignupSave {
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

    return {
      player,
      city,
      buildings,
      technologies
    }
  }
  async save({
    player,
    city,
    buildings,
    technologies
  }: SignupSave): Promise<SignupResponse> {
    await Promise.all([
      this.repository.player.create(player),
      this.repository.city.create(city),
      ...buildings.map(building => this.repository.building.create(building)),
      ...technologies.map(technology => this.repository.technology.create(technology))
    ])

    return {
      player_id: player.id,
      city_id: city.id
    }
  }
}
