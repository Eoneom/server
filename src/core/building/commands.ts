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
  code: BuildingCode
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
    const buildings = this.service.initBuildings({
      city_id,
    })

    await Promise.all(
      buildings.map((building) => this.repository.create(building))
    )
    Factory.getEventBus().emit(BuildingEventCode.FIRST_INITIALIZED, { city_id })
  }

  async requestUpgrade({ code, city_id }: { code: BuildingCode, city_id: string }): Promise<void> {
    const is_building_in_progress = await this.repository.exists({
      city_id,
      upgraded_at: {
        $exists: true,
        $ne: null
      }
    })

    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    const building = await this.repository.findOne({ code, city_id })
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    Factory.getEventBus().emit(BuildingEventCode.UPGRADE_REQUESTED, {
      city_id,
      code,
      current_level: building.level
    })
  }

  async launchUpgrade({ code, city_id, duration }: BuildingLaunchUpgradeCommand): Promise<void> {
    const building = await this.repository.findOne({ code, city_id })
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const updated_building = building.launchUpgrade(duration)
    await this.repository.updateOne(updated_building)
    Factory.getEventBus().emit(BuildingEventCode.UPGRADE_LAUNCHED, { code })
  }

  async finishUpgradeIfAny({ city_id }: BuildingFinishUpgradesCommand): Promise<void> {
    const building_to_finish = await this.repository.findOne({
      city_id,
      upgraded_at: {
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
