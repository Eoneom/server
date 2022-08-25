import { createCity, gatherWood, launchBuildingUpgrade, upgradeBuildings } from './cities/commands'

import { WOOD_CAMP } from './cities/constants'
import { now } from './shared/time'

let city = createCity('Moustachiopolis')
city = gatherWood(city, now())
console.log(`wood=${city.wood}, woodcamp_level=${city.buildings[WOOD_CAMP].level}`)
city = launchBuildingUpgrade(city, WOOD_CAMP)

setInterval(() => {
  city = upgradeBuildings(city)
  city = gatherWood(city, now())

  console.log(`wood=${city.wood}, woodcamp_level=${city.buildings[WOOD_CAMP].level}`)
}, 500)

export { }
