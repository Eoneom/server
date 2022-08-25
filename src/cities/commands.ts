import { STARTING_WOOD, WOOD_CAMP } from './constants'
import { getBuildingInProgress, getSecondsSinceLastGather, getWoodEarningsBySecond, getWoodUpgradeTimeInSeconds, isBuildingInProgress, isBuildingUpgradeDone } from './queries'

import { City } from './model'
import { now } from '../shared/time'

export const createCity = (name: string): City => ({
  name,
  buildings: {
    [WOOD_CAMP]: {
      code: WOOD_CAMP,
      level: 1
    }
  },
  wood: STARTING_WOOD,
  last_gather: new Date().getTime()
})

export const launchBuildingUpgrade = (city: City, building_code: string): City => {
  if (isBuildingInProgress(city)) {
    return city
  }

  const building = city.buildings[building_code]
  if (!building) {
    return city
  }

  const upgrade_time_in_seconds = getWoodUpgradeTimeInSeconds(city)
  console.log(building.code, ' upgrade launched')
  return {
    ...city,
    buildings: {
      ...city.buildings,
      [building_code]: {
        ...building,
        upgrade_time: now() + upgrade_time_in_seconds * 1000
      }
    }
  }
}

export const upgradeBuildings = (city: City): City => {
  const building = getBuildingInProgress(city)
  if (!building) {
    return city
  }

  const upgrade_time = building.upgrade_time!

  if (!isBuildingUpgradeDone(building)) {
    console.log(building.code, 'upgrade in progress', Math.round((upgrade_time - now()) / 1000), 'seconds remaining')
    return city
  }

  console.log(building.code, ' upgraded ')
  return {
    ...city,
    buildings: {
      ...city.buildings,
      [building.code]: {
        ...building,
        level: building.level + 1,
        upgrade_time: undefined
      }
    }
  }
}

export const gatherResources = (city: City): City => {
  const seconds_since_last_gather = getSecondsSinceLastGather(city)
  if (seconds_since_last_gather < 1) {
    return city
  }

  const wood_gains = seconds_since_last_gather * getWoodEarningsBySecond(city)
  return {
    ...city,
    last_gather: now(),
    wood: city.wood + wood_gains
  }
}
