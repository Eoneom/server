import { BuildingCode } from './domain/constants'
import { BuildingEntity } from './domain/entity'
import { BuildingErrors } from './domain/errors'
import { BuildingRepository } from './repository'
import { BuildingService } from './domain/service'
import { CityQueries } from '../city/queries'
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

export interface BuildingFinishUpgradesCommand {
  city_id: string
}

export class BuildingCommands {
  private repository: BuildingRepository
  private service: BuildingService
  private city_queries: CityQueries

  constructor({
    repository,
    service,
    city_queries
  }: {
    repository: BuildingRepository,
    service: BuildingService,
    city_queries: CityQueries
  }) {
    this.repository = repository
    this.service = service
    this.city_queries = city_queries
  }

  async create({ code, city_id, level }: BuildingCreateCommand): Promise<string> {
    const building_already_exists = await this.repository.exists({ code, city_id })
    if (building_already_exists) {
      throw new Error(BuildingErrors.ALREADY_EXISTS)
    }

    const building = new BuildingEntity({
      id: 'fake',
      code,
      city_id,
      level
    })

    console.log('create building', { building })
    return this.repository.create(building)
  }

  async launchUpgrade({ code, city_id }: BuildingLaunchUpgradeCommand): Promise<void> {
    const building_in_progress = await this.repository.findOne({
      city_id,
      upgrade_time: {
        $exists: true,
        $ne: null
      }
    })

    // const has_size_to_build = await Factory.getCityApp().queries.hasSizeToBuild(city_id)
    // if (!has_size_to_build) {
    //   throw new Error(CityErrors.NOT_ENOUGH_SIZE)
    // }

    const building = await this.repository.findOne({ code, city_id })
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const wood_cost = this.service.getWoodCostsForUpgrade(building)
    const has_enough_resources = await this.city_queries.hasResources({ city_id, wood: wood_cost })

    const result = this.service.launchUpgrade({
      building,
      has_enough_resources,
      is_building_in_progress: Boolean(building_in_progress)
    })

    await this.repository.updateOne(result.building)
    console.log(building.code, ' upgrade launched')
  }

  async finishUpgrades({ city_id }: BuildingFinishUpgradesCommand): Promise<boolean> {
    const building_to_finish = await this.repository.findOne({
      city_id,
      upgrade_time: {
        $lte: now()
      }
    })

    if (!building_to_finish) {
      return false
    }

    const finished_building = building_to_finish.finishUpgrade()

    await this.repository.updateOne(finished_building)
    console.log(`${finished_building.code} upgrade done`)

    return true
  }
}
