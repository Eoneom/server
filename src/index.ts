import { createCity, gatherWood, launchBuildingUpgrade, upgradeBuildings } from './cities/commands'

import { WOOD_CAMP } from './cities/constants'
import { now } from './shared/time'
import repl from 'repl'

let city = createCity('Moustachiopolis')
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
export { }
