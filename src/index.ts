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

  const { id: city_id } = await init(app)

  setInterval(async () => {
    await app.building.commands.finishUpgrades({ city_id })
    await app.city.commands.gatherPlastic({ id: city_id, gather_at_time: now() })
    await app.city.commands.gatherMushroom({ id: city_id, gather_at_time: now() })
  }, 1000)

  const local = repl.start('> ')
  local.context.g = {
    city: () => app.city.queries.findByIdOrThrow(city_id).then(console.log),
    launchRecyclingPlantUpgrade: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.RECYCLING_PLANT, city_id })
    },
    launchMushroomFarmUpgrade: () => {
      app.building.commands.launchUpgrade({ code: BuildingCode.MUSHROOM_FARM, city_id })
    }
  }
})()

export { }
