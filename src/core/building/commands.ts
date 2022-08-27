import { BuildingCreateParams, BuildingRepository } from './repository'
import { getWoodCostsForUpgrade, getWoodUpgradeTimeInSeconds } from '../city/queries'

import { BuildingCode } from './constants'
import { BuildingErrors } from './errors'
import { CityErrors } from '../city/errors'
import { Factory } from '../../factory'
import { now } from '../shared/time'

export interface BuildingCreateCommand {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingLaunchUpgradeCommand {
  code: BuildingCode
  city_id: string
}

export class BuildingCommands {
  private repository: BuildingRepository

  constructor(
    repository: BuildingRepository
  ) {
    this.repository = repository
  }

  async create({ code, city_id, level }: BuildingCreateCommand): Promise<string> {
    const building_already_exists = await this.repository.exists({ code, city_id })
    if (building_already_exists) {
      throw new Error(BuildingErrors.ALREADY_EXISTS)
    }

    const building: BuildingCreateParams = {
      code,
      city_id,
      level
    }

    console.log('create building', { building })
    return this.repository.create(building)
  }

  async launchUpgrade({ code, city_id }: BuildingLaunchUpgradeCommand): Promise<void> {
    const city = await Factory.getCityApp().queries.findById(city_id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const building_in_progress = await this.repository.getInProgress({ city_id })
    if (building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    const has_size_to_build = await Factory.getCityApp().queries.hasSizeToBuild(city_id)
    if (!has_size_to_build) {
      throw new Error(CityErrors.NOT_ENOUGH_SIZE)
    }

    const building = await this.repository.findByCode(code)
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const wood_costs = getWoodCostsForUpgrade(building)
    if (city.wood < wood_costs) {
      throw new Error(CityErrors.NOT_ENOUGH_WOOD)
    }

    const upgrade_time_in_seconds = getWoodUpgradeTimeInSeconds(building.level)
    await this.repository.save({
      ...building,
      upgrade_time: now() + upgrade_time_in_seconds
    })

    console.log(building.code, ' upgrade launched')
  }
}
