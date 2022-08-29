import { CityRepository, CreateParams } from '../ports/repository/city'

import { BuildingCode } from '../building/constants'
import { BuildingErrors } from '../building/errors'
import { CityErrors } from './domain/errors'
import { Repository } from '../shared/repository'
import { STARTING_WOOD } from './domain/constants'
import {
  getWoodEarningsBySecond,
} from './queries'
import { now } from '../shared/time'

interface CreateCityCommand {
  name: string
}

interface CityGatherWoodCommand {
  id: string
  gather_at_time: number
}

export class CityCommands {
  private repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async create({ name }: CreateCityCommand): Promise<string> {
    const city_already_exists = await this.repository.city.exists(name)
    if (city_already_exists) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const city: CreateParams = {
      name,
      wood: STARTING_WOOD,
      last_wood_gather: new Date().getTime(),
    }

    return this.repository.city.create(city)
  }

  async gatherWood({ id, gather_at_time }: CityGatherWoodCommand): Promise<void> {
    const city = await this.repository.city.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    if (gather_at_time <= city.last_wood_gather) {
      return
    }

    const seconds_since_last_gather = Math.round(gather_at_time - city.last_wood_gather) / 1000
    if (seconds_since_last_gather < 1) {
      return
    }

    const building = await this.repository.building.findOne({ code: BuildingCode.WOOD_CAMP, city_id: city.id })
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const wood_earnings = Math.floor(seconds_since_last_gather * getWoodEarningsBySecond(building.level))
    await this.repository.city.update({
      id,
      wood: city.wood + wood_earnings,
      last_wood_gather: now()
    })
  }
}

// export const launchBuildingUpgrade = (city: CityEntity, building_code: string): CityEntity => {
//   if (isBuildingInProgress(city)) {
//     console.error('building already in progress')
//     return city
//   }

//   if (!hasSizeToBuild(city)) {
//     console.error('not enough size to build')
//     return city
//   }

//   const building = city.buildings[building_code]
//   if (!building) {
//     return city
//   }

//   const wood_costs = getWoodCostsForUpgrade(building)
//   if (city.wood < wood_costs) {
//     console.error(`not enough wood to build, required=${wood_costs}, current=${city.wood}`)
//     return city
//   }

//   const upgrade_time_in_seconds = getWoodUpgradeTimeInSeconds(building.level)
//   console.log(building.code, ' upgrade launched')
//   return {
//     ...city,
//     wood: city.wood - wood_costs,
//     buildings: {
//       ...city.buildings,
//       [building_code]: {
//         ...building,
//         upgrade_time: now() + upgrade_time_in_seconds * 1000
//       }
//     }
//   }
// }

// export const upgradeBuildings = (city: CityEntity): CityEntity => {
//   const building = getBuildingInProgress(city)
//   if (!building) {
//     return city
//   }

//   const upgrade_time = building.upgrade_time!

//   if (!isBuildingUpgradeDone(building)) {
//     const seconds_remaining = Math.round((upgrade_time - now()) / 1000)
//     console.log(`${building.code} upgrade in progress ${seconds_remaining} seconds remaining`)
//     return city
//   }

//   console.log(`${building.code} upgraded`)
//   let new_city = city
//   // if (BuildingCode.WOOD_CAMP === building.code) {
//   //   new_city = gatherWood(city, upgrade_time)
//   // }

//   return upgradeBuilding(new_city, building)
// }

// const upgradeBuilding = (city: CityEntity, building: BuildingEntity): CityEntity => {
//   return {
//     ...city,
//     buildings: {
//       ...city.buildings,
//       [building.code]: {
//         ...building,
//         level: building.level + 1,
//         upgrade_time: undefined
//       }
//     }
//   }
// }
