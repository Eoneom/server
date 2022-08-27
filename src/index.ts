import { gatherWood, launchBuildingUpgrade, upgradeBuildings } from './core/city/commands'

import { BuildingApp } from './core/building/app'
import { BuildingCode } from './core/building/constants'
import { CityApp } from './core/city/app'
import { CityEntity } from './core/city/entity'
import { MongoRepository } from './database'
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
  const repository = new MongoRepository()
  await repository.connect()

  const city_app = new CityApp(repository.city)
  const building_app = new BuildingApp(repository.building)
  let city = await init(city_app, building_app)

  setInterval(() => {
    city = upgradeBuildings(city)
    city = gatherWood(city, now())
  }, 1000)
  console.log(city)

  const local = repl.start('> ')
  local.context.g = {
    city: () => city,
    now,
    launchWoodcampUpgrade: () => { city = launchBuildingUpgrade(city, BuildingCode.WOOD_CAMP) }
  }
})()
export { }
