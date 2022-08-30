import { BuildingCode } from './domain/constants'
import { BuildingEntity } from './domain/entity'
import { BuildingErrors } from './domain/errors'
import { BuildingRepository } from './repository'
import { BuildingService } from './domain/service'
import { CityCommands } from '../city/commands'
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

export interface BuildingInitCityCommand {
  city_id: string
}

export class BuildingCommands {
  private repository: BuildingRepository
  private service: BuildingService
  private city_commands: CityCommands

  constructor({
    repository,
    service,
    city_commands
  }: {
    repository: BuildingRepository,
    service: BuildingService,
    city_commands: CityCommands
  }) {
    this.repository = repository
    this.service = service
    this.city_commands = city_commands
  }

  async initFirstBuildings({ city_id }: BuildingInitCityCommand): Promise<void> {
    const has_building_in_city = await this.repository.exists({ city_id })
    const { buildings } = this.service.initBuildings({
      city_id,
      has_building_in_city
    })

    await Promise.all(
      buildings.map((building) => this.repository.create(building))
    )
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

    const plastic_cost = this.service.getPlasticCostsForUpgrade(building)
    await this.city_commands.purchase({ id: city_id, plastic_cost })

    const result = this.service.launchUpgrade({
      building,
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
