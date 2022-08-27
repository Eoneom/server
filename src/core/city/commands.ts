import { Building, CityEntity } from './model'
import { CityRepository, CreateParams } from './repository'
import { STARTING_WOOD, WOOD_CAMP } from './constants'
import {
  getBuildingInProgress,
  getWoodCostsForUpgrade,
  getWoodEarningsBySecond,
  getWoodUpgradeTimeInSeconds,
  hasSizeToBuild,
  isBuildingInProgress,
  isBuildingUpgradeDone
} from './queries'

import { ERR_CITY_ALREADY_EXISTS } from './errors'
import { Repository } from '../shared/repository'
import { now } from '../shared/time'

interface CreateCityCommand {
  name: string
}

export class CityCommands {
  private repository: CityRepository

  public constructor(repository: CityRepository) {
    this.repository = repository
  }

  public async create({ name }: CreateCityCommand): Promise<string> {
    const city_already_exists = await this.repository.exists(name)
    if (city_already_exists) {
      throw new Error(ERR_CITY_ALREADY_EXISTS)
    }

    const city: CreateParams = {
      name,
      wood: STARTING_WOOD,
      last_wood_gather: new Date().getTime(),
    }

    return this.repository.create(city)
  }
}

export const createCity = (name: string): CityEntity => ({
  id: 'tmp-id',
  name,
  buildings: {
    [WOOD_CAMP]: {
      code: WOOD_CAMP,
      level: 1
    }
  },
  wood: STARTING_WOOD,
  last_wood_gather: new Date().getTime(),
  cells: [{ x: 10, y: 10 }]
})

export const launchBuildingUpgrade = (city: CityEntity, building_code: string): CityEntity => {
  if (isBuildingInProgress(city)) {
    console.error('building already in progress')
    return city
  }

  if (!hasSizeToBuild(city)) {
    console.error('not enough size to build')
    return city
  }

  const building = city.buildings[building_code]
  if (!building) {
    return city
  }

  const wood_costs = getWoodCostsForUpgrade(building)
  if (city.wood < wood_costs) {
    console.error(`not enough wood to build, required=${wood_costs}, current=${city.wood}`)
    return city
  }

  const upgrade_time_in_seconds = getWoodUpgradeTimeInSeconds(city)
  console.log(building.code, ' upgrade launched')
  return {
    ...city,
    wood: city.wood - wood_costs,
    buildings: {
      ...city.buildings,
      [building_code]: {
        ...building,
        upgrade_time: now() + upgrade_time_in_seconds * 1000
      }
    }
  }
}

export const upgradeBuildings = (city: CityEntity): CityEntity => {
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

export const gatherWood = (city: CityEntity, gather_at_time: number): CityEntity => {
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

const upgradeBuilding = (city: CityEntity, building: Building): CityEntity => {
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
