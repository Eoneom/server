import { BuildingCode } from './domain/constants'
import { BuildingRepository } from './model'
import { BuildingService } from './domain/service'
import { now } from '../../shared/time'
import { BuildingEntity } from './domain/entity'

export interface BuildingCreateCommand {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingLaunchUpgradeCommand {
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

  async init({ city_id }: BuildingInitCityCommand): Promise<void> {
    const buildings = this.service.initBuildings({
      city_id,
    })

    await Promise.all(buildings.map((building) => this.repository.create(building)))
  }

  async launchUpgrade({ building, duration }: BuildingLaunchUpgradeCommand): Promise<void> {
    const updated_building = building.launchUpgrade(duration)
    await this.repository.updateOne(updated_building)
  }

  async finishUpgrade({ city_id }: BuildingFinishUpgradesCommand): Promise<void> {
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
  }
}
