import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './repository'
import { STARTING_WOOD } from './domain/constants'
import { now } from '../shared/time'

interface CreateCityCommand {
  name: string
}

interface CityGatherWoodCommand {
  id: string
  gather_at_time: number
}

export class CityCommands {
  private repository: CityRepository
  private building_queries: BuildingQueries

  constructor({
    repository,
    building_queries
  }: {
    repository: CityRepository,
    building_queries: BuildingQueries
  }) {
    this.repository = repository
    this.building_queries = building_queries
  }

  async create({ name }: CreateCityCommand): Promise<string> {
    console.log('CityCommands.create')
    const city_already_exists = await this.repository.exists({ name })
    if (city_already_exists) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const city = new CityEntity({
      id: 'fake',
      name,
      wood: STARTING_WOOD,
      last_wood_gather: new Date().getTime(),
    })

    return this.repository.create(city)
  }

  async gatherWood({ id, gather_at_time }: CityGatherWoodCommand): Promise<void> {
    console.log('CityCommands.gatherWood')
    const city = await this.repository.findById(id)
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

    const earnings = await this.building_queries.getCityWoodEarningsBySecond({ city_id: city.id })
    const wood_earnings = Math.floor(seconds_since_last_gather * earnings)
    const updated_city = new CityEntity({
      ...city,
      wood: city.wood + wood_earnings,
      last_wood_gather: now()
    })

    await this.repository.updateOne(updated_city)
  }
}

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
