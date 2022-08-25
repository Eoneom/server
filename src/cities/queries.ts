import { Building, City } from './model'
import { WOOD_CAMP, wood_camp_gains_by_level_by_seconds, wood_camp_upgrade_time_in_seconds } from './constants'

import { now } from '../shared/time'

export const getSecondsSinceLastWoodGather = (city: City): number => {
  const now_in_seconds = now()
  return Math.floor((now_in_seconds - city.last_wood_gather) / 1000)
}

export const isBuildingUpgradeDone = (building: Building): boolean => {
  if (!building.upgrade_time) {
    return true
  }

  return now() - building.upgrade_time > 0
}

export const getBuildingInProgress = (city: City): Building | undefined => {
  return Object.values(city.buildings).find(building => building.upgrade_time)
}

export const getWoodEarningsBySecond = (city: City): number => {
  const wood_camp = city.buildings[WOOD_CAMP]
  return wood_camp_gains_by_level_by_seconds[wood_camp.level]
}

export const getWoodUpgradeTimeInSeconds = (city: City): number => {
  const wood_camp = city.buildings[WOOD_CAMP]
  return wood_camp_upgrade_time_in_seconds[wood_camp.level + 1]
}

export const isBuildingInProgress = (city: City): boolean => {
  return Object.values(city.buildings).some(building => building.upgrade_time)
}
