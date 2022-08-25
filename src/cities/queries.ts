import { WOOD_CAMP, wood_camp_gains_by_level_by_seconds } from './constants'

import { City } from './model'

export const getSecondsSinceLastGather = (city: City): number => {
  const now_in_seconds = new Date().getTime()
  return Math.floor((now_in_seconds - city.last_gather) / 1000)
}

export const getWoodEarningsBySecond = (city: City): number => {
  const wood_camp = city.buildings[WOOD_CAMP]
  return wood_camp_gains_by_level_by_seconds[wood_camp.level]
}
