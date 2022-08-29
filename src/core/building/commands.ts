import { BuildingCode } from './constants'
import { BuildingCreateParams } from '../ports/repository/building'
import { BuildingErrors } from './errors'
import { BuildingService } from './service'
import { CityErrors } from '../city/domain/errors'
import { Repository } from '../shared/repository'

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
  private repository: Repository

  constructor(
    repository: Repository
  ) {
    this.repository = repository
  }

  async create({ code, city_id, level }: BuildingCreateCommand): Promise<string> {
    const building_already_exists = await this.repository.building.exists({ code, city_id })
    if (building_already_exists) {
      throw new Error(BuildingErrors.ALREADY_EXISTS)
    }

    const building: BuildingCreateParams = {
      code,
      city_id,
      level
    }

    console.log('create building', { building })
    return this.repository.building.create(building)
  }

  async launchUpgrade({ code, city_id }: BuildingLaunchUpgradeCommand): Promise<void> {
    const city = await this.repository.city.findById(city_id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const building_in_progress = await this.repository.building.getInProgress({ city_id })
    if (building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    // const has_size_to_build = await Factory.getCityApp().queries.hasSizeToBuild(city_id)
    // if (!has_size_to_build) {
    //   throw new Error(CityErrors.NOT_ENOUGH_SIZE)
    // }

    const building = await this.repository.building.findOne({ code, city_id })
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const service = new BuildingService()
    const result = service.launchUpgrade({ building, city })

    await this.repository.building.save(result.building)
    console.log(building.code, ' upgrade launched')
  }
}
