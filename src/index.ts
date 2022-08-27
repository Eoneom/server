import { gatherWood, launchBuildingUpgrade, upgradeBuildings } from './core/city/commands'

import { CityApp } from './core/city/app'
import { CityEntity } from './core/city/model'
import { MongoRepository } from './database'
import { WOOD_CAMP } from './core/city/constants'
import { now } from './core/shared/time'
import repl from 'repl'

const city_name = 'Moustachiopolis'

const init = async (city_app: CityApp): Promise<CityEntity> => {
  const city = await city_app.queries.findOne({ name: city_name })
  if (city) {
    return city
  }

  const city_id = await city_app.commands.create({ name: city_name })
  const created_city = await city_app.queries.findById(city_id)
  if (!created_city) {
    throw new Error('unknown')
  }

  return created_city
}

(async () => {
  const repository = new MongoRepository()
  await repository.connect()

  const city_app = new CityApp(repository.city)
  let city = await init(city_app)

  setInterval(() => {
    city = upgradeBuildings(city)
    city = gatherWood(city, now())
  }, 1000)
  console.log(city)

  const local = repl.start('> ')
  local.context.g = {
    city: () => city,
    now,
    launchWoodcampUpgrade: () => { city = launchBuildingUpgrade(city, WOOD_CAMP) }
  }
})()
export { }
