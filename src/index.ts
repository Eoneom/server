import { App } from './core/app'
import { BuildingCode } from './core/building/domain/constants'
import { CityEntity } from './core/city/domain/entity'
import { Factory } from './core/factory'
import { now } from './core/shared/time'
import repl from 'repl'

const city_name = 'Moustachiopolis'

const init = async (app: App): Promise<CityEntity> => {
  const city = await app.city.queries.findOne({ name: city_name })
  if (city) {
    return city
  }

  const city_id = await app.city.commands.init({ name: city_name })
  const created_city = await app.city.queries.findByIdOrThrow(city_id)

  await app.building.commands.initFirstBuildings({ city_id })

  return created_city
}

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()

  const app = new App()

  const city = await init(app)
  const city_id = city.id

  await app.city.commands.gatherResources({ id: city_id, gather_at_time: now() })
  const updated_city = await app.city.queries.findByIdOrThrow(city_id)
  console.log(updated_city)

  setInterval(async () => {
    await app.building.commands.finishUpgrades({ city_id })
    await app.city.commands.gatherResources({ id: city_id, gather_at_time: now() })
  }, 1000)

  const local = repl.start('> ')
  local.context.g = {
    city: () => app.city.queries.findByIdOrThrow(city_id).then(console.log),
    launchRecyclingPlantUpgrade: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.RECYCLING_PLANT, city_id })
    },
    launchMushroomFarmUpgrade: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.MUSHROOM_FARM, city_id })
    },
    launchResearchLabUpgrade: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.RESEARCH_LAB, city_id })
    },
    buildings: () => {
      app.building.queries.getBuildings({ city_id }).then(console.log)
    }
  }
})()

export { }
