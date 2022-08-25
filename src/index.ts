import { createCity, gatherResources, launchBuildingUpgrade, upgradeBuildings } from './cities/commands'

import { WOOD_CAMP } from './cities/constants'

let city = createCity('Moustachiopolis')
city = launchBuildingUpgrade(city, WOOD_CAMP)

setInterval(() => {
  city = upgradeBuildings(city)
  city = gatherResources(city)

  console.log(city.buildings[WOOD_CAMP].level)
}, 1000)

export { }
