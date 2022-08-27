import { createCity, gatherWood, launchBuildingUpgrade, upgradeBuildings } from './core/cities/commands'

import { CityModel } from './database/models/city'
import { WOOD_CAMP } from './core/cities/constants'
import { connectToDatabase } from './database'
import { now } from './core/shared/time'
import repl from 'repl'

const city_name = 'Moustachiopolis';

(async () => {
  await connectToDatabase()
  console.log('connected to database')
  let city = createCity('Moustachiopolis')

  const database_city = await CityModel.findOne({ name: city_name })
  if (!database_city) {
    console.log('creating first city')
    await CityModel.create(createCity(city_name))
  } else {
    city = {
      ...city,
      wood: database_city.wood ?? 0,
      last_wood_gather: database_city.last_wood_gather ?? 0
    }
  }

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
