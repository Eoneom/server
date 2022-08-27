import { BuildingApp } from './core/building/app'
import { BuildingCode } from './core/building/constants'
import { CityApp } from './core/city/app'
import { CityEntity } from './core/city/entity'
import { Factory } from './factory'
import { now } from './core/shared/time'
import repl from 'repl'

const city_name = 'Moustachiopolis'

const init = async (
  city_app: CityApp,
  building_app: BuildingApp
): Promise<CityEntity> => {
  const city = await city_app.queries.findOne({ name: city_name })
  if (city) {
    return city
  }

  const city_id = await city_app.commands.create({ name: city_name })
  const created_city = await city_app.queries.findById(city_id)
  if (!created_city) {
    throw new Error('unknown')
  }

  await building_app.commands.create({
    code: BuildingCode.WOOD_CAMP,
    city_id,
    level: 1
  })

  return created_city
}

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()
  const city_app = Factory.getCityApp()
  const building_app = Factory.getBuildingApp()

  const { id: city_id } = await init(city_app, building_app)

  setInterval(async () => {
    // city = upgradeBuildings(city)
    await city_app.commands.gatherWood({ id: city_id, gather_at_time: now() })
  }, 1000)

  const local = repl.start('> ')
  local.context.g = {
    city: () => city_app.queries.findById(city_id).then(console.log),
    now,
    launchWoodcampUpgrade: () => {
      building_app.commands.launchUpgrade({ code: BuildingCode.WOOD_CAMP, city_id })
    }
  }
})()

export { }
