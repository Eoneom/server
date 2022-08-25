import { STARTING_WOOD, WOOD_CAMP, wood_camp_gains_by_level_by_seconds } from './constants'
import { getSecondsSinceLastGather, getWoodEarningsBySecond } from './queries'

import { City } from './model'

export const createCity = (name: string): City => ({
  name,
  buildings: {
    [WOOD_CAMP]: {
      level: 2
    }
  },
  wood: STARTING_WOOD,
  last_gather: new Date().getTime()
})

export const gatherResources = (city: City): City => {
  const seconds_since_last_gather = getSecondsSinceLastGather(city)
  if (seconds_since_last_gather < 1) {
    return city
  }

  const wood_gains = seconds_since_last_gather * getWoodEarningsBySecond(city)
  return {
    ...city,
    last_gather: new Date().getTime(),
    wood: city.wood + wood_gains
  }
}
