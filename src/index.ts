import { App } from './core/app'
import { BuildingCode } from './core/building/domain/constants'
import { BuildingEventCode } from './core/building/domain/events'
import { CityEntity } from './core/city/domain/entity'
import { CityErrors } from './core/city/domain/errors'
import { CityEventCode } from './core/city/domain/events'
import { Factory } from './core/factory'
import { Payloads } from './core/eventbus'
import { PlayerEntity } from './core/player/domain/entity'
import { PlayerErrors } from './core/player/domain/errors'
import { TechnologyCode } from './core/technology/domain/constants'
import { init_costs } from './core/migrations/init_costs'
import { now } from './core/shared/time'
import repl from 'repl'

const player_name = 'Kroustille'
const city_name = 'Moustachiopolis'

const init = async (app: App): Promise<{ player: PlayerEntity, city: CityEntity }> => {
  const player = await app.player.queries.findOne({ name: player_name })
  if (player) {
    const city = await app.city.queries.findOne({ name: city_name })
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    return { player, city }
  }

  const player_id = await app.player.commands.init({ name: player_name, first_city_name: city_name })
  const created_player = await app.player.queries.findById(player_id)
  if (!created_player) {
    throw new Error(PlayerErrors.NOT_FOUND)
  }

  const created_city = await app.city.queries.findOne({ name: city_name })
  if (!created_city) {
    throw new Error(CityErrors.NOT_FOUND)
  }

  return {
    player: created_player,
    city: created_city
  }
}

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()

  const app = new App()

  const event_codes = [
    ...Object.values(CityEventCode).filter(value => value !== CityEventCode.RESOURCES_GATHERED),
    ...Object.values(BuildingEventCode)
  ]

  event_codes.forEach((event_code) => {
    Factory.getEventBus().listen(
      event_code,
      (payload) => console.log(event_code, payload)
    )
  })


  const existing_costs = await app.pricing.queries.doesLevelCostsExists()
  if (!existing_costs) {
    await init_costs(app)
  }

  const { city, player } = await init(app)
  console.log(player)
  const player_id = player.id
  const city_id = city.id

  await app.city.commands.gatherResources({ id: city_id, gather_at_time: now() })
  const updated_city = await app.city.queries.findByIdOrThrow(city_id)
  console.log(updated_city)

  setInterval(async () => {
    await app.building.commands.finishUpgradeIfAny({ city_id })
    await app.technology.commands.finishResearches({ player_id })
    await app.city.commands.gatherResources({ id: city_id, gather_at_time: now() })
  }, 1000)

  const local = repl.start('> ')
  local.context.g = {
    city: () => app.city.queries.findByIdOrThrow(city_id).then(console.log),
    researchBuilding: () => {
      app.technology.commands.launchResearch({ code: TechnologyCode.BUILDING, player_id, city_id })
    },
    upgradeRecyclingPlant: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.RECYCLING_PLANT, city_id })
    },
    upgradeMushroomFarm: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.MUSHROOM_FARM, city_id })
    },
    upgradeResearchLab: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.RESEARCH_LAB, city_id })
    },
    buildings: () => {
      app.building.queries.getBuildings({ city_id }).then(console.log)
    }
  }
})()

export { }
