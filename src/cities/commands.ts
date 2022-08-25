import { Building, City } from './model'
import { STARTING_WOOD, WOOD_CAMP } from './constants'
import { getBuildingInProgress, getSecondsSinceLastWoodGather, getWoodEarningsBySecond, getWoodUpgradeTimeInSeconds, isBuildingInProgress, isBuildingUpgradeDone } from './queries'

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
  last_wood_gather: new Date().getTime()
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
    const seconds_remaining = Math.round((upgrade_time - now()) / 1000)
    console.log(`${building.code} upgrade in progress ${seconds_remaining} seconds remaining`)
    return city
  }

  console.log(`${building.code} upgraded`)
  let new_city = city
  if (WOOD_CAMP === building.code) {
    new_city = gatherWood(city, upgrade_time)
  }

  return upgradeBuilding(new_city, building)
}

export const gatherWood = (city: City, gather_at_time: number): City => {
  if (gather_at_time <= city.last_wood_gather) {
    return city
  }

  const seconds_since_last_gather = Math.round(gather_at_time - city.last_wood_gather) / 1000
  if (seconds_since_last_gather < 1) {
    return city
  }

  const wood_earnings = Math.floor(seconds_since_last_gather * getWoodEarningsBySecond(city))
  return {
    ...city,
    last_wood_gather: gather_at_time,
    wood: city.wood + wood_earnings
  }
}

const upgradeBuilding = (city: City, building: Building): City => {
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
