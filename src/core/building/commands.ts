import { BuildingCode } from './domain/constants'
import { BuildingRepository } from './model'
import { BuildingService } from './domain/service'
import { now } from '../../shared/time'
import { BuildingEntity } from './domain/entity'
import { BuildingErrors } from 'src/core/building/domain/errors'

export interface BuildingCreateCommand {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingLaunchUpgradeCommand {
  city_id: string
  building: BuildingEntity
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

  init({ city_id }: BuildingInitCityCommand): BuildingEntity[] {
    return this.service.initBuildings({
      city_id,
    })
  }

  async launchUpgrade({ city_id, building, duration }: BuildingLaunchUpgradeCommand): Promise<BuildingEntity> {
    const is_building_in_progress = await this.repository.exists({
      city_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })
    if (!is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    return building.launchUpgrade(duration)
  }

  async finishUpgrade({ city_id }: BuildingFinishUpgradesCommand): Promise<void> {
    const building_to_finish = await this.repository.findOne({
      city_id,
      upgrade_at: {
        $lte: now()
      }
    })
    if (!building_to_finish) {
      return
    }

    const finished_building = building_to_finish.finishUpgrade()
    await this.repository.updateOne(finished_building)
  }
}
