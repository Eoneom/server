import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { BuildingService } from '#core/building/service'
import { CityService } from '#core/city/service'
import { PlayerService } from '#core/player/service'
import { TechnologyService } from '#core/technology/service'
import { TroupService } from '#core/troup/service'
import { ExplorationEntity } from '#core/world/exploration.entity'

export interface SignupAuthParams {
  city_name: string
  player_name: string
}

export interface SignupAuthResult {
  player_id: string
  city_id: string
}

export async function signupAuth({
  player_name,
  city_name,
}: SignupAuthParams): Promise<SignupAuthResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:auth:signup')
  logger.info('run')

  const [
    does_player_exist,
    does_city_exist,
    city_first_cell,
  ] = await Promise.all([
    repository.player.exist(player_name),
    repository.city.exist(city_name),
    AppService.selectCityFirstCell(),
  ])

  const cells_around_city = await AppService.getCellsAround({ coordinates: city_first_cell.coordinates })

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

  await Promise.all([
    repository.player.create(player),
    repository.city.create(city),
    ...buildings.map(building => repository.building.create(building)),
    ...technologies.map(technology => repository.technology.create(technology)),
    repository.cell.updateOne(cell),
    ...troups.map(troup => repository.troup.create(troup)),
    repository.exploration.create(exploration)
  ])

  return {
    player_id: player.id,
    city_id: city.id
  }
}
