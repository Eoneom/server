import { BuildingCode } from './domain/constants'
import { BuildingErrors } from './domain/errors'
import { BuildingEventCode } from './domain/events'
import { BuildingRepository } from './repository'
import { BuildingService } from './domain/service'
import { Factory } from '../factory'
import { now } from '../shared/time'

export interface BuildingCreateCommand {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingLaunchUpgradeCommand {
  building_code: BuildingCode
  city_id: string
  duration: number
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

  constructor({
    repository,
    service,
  }: {
    repository: BuildingRepository
    service: BuildingService
  }) {
    this.repository = repository
    this.service = service
  }

  async initFirstBuildings({ city_id }: BuildingInitCityCommand): Promise<void> {
    const has_building_in_city = await this.repository.exists({ city_id })
    const buildings = this.service.initBuildings({
      city_id,
      has_building_in_city
    })

    await Promise.all(
      buildings.map((building) => this.repository.create(building))
    )
    Factory.getEventBus().emit(BuildingEventCode.INITIALIZED, { city_id })
  }

  async launchUpgrade({ building_code: code, city_id, duration }: BuildingLaunchUpgradeCommand): Promise<void> {
    const is_building_in_progress = await this.repository.exists({
      city_id,
      upgrade_time: {
        $exists: true,
        $ne: null
      }
    })

    const building = await this.repository.findOne({ code, city_id })
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const result = this.service.launchUpgrade({
      building,
      is_building_in_progress,
      duration
    })

    await this.repository.updateOne(result.building)
    Factory.getEventBus().emit(BuildingEventCode.UPGRADE_LAUNCHED, { code })
  }

  async finishUpgradeIfAny({ city_id }: BuildingFinishUpgradesCommand): Promise<void> {
    const building_to_finish = await this.repository.findOne({
      city_id,
      upgrade_time: {
        $lte: now()
      }
    })

    if (!building_to_finish) {
      return
    }

    const finished_building = building_to_finish.finishUpgrade()

    await this.repository.updateOne(finished_building)
    Factory.getEventBus().emit(BuildingEventCode.UPGRADED, {
      code: finished_building.code
    })
  }
}
