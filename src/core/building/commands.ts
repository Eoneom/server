import { BuildingCode } from '#core/building/domain/constants'
import { BuildingEntity } from '#core/building/domain/entity'
import { BuildingErrors } from '#core/building/domain/errors'
import { BuildingService } from '#core/building/domain/service'
import { BuildingRepository } from '#core/building/model'
import { now } from '#shared/time'

export interface BuildingCreateCommand {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingLaunchUpgradeCommand {
  city_id: string
  building: BuildingEntity
  duration: number
  architecture_bonus: number
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
    return this.service.initBuildings({ city_id })
  }

  async launchUpgrade({
    city_id,
    building,
    duration,
    architecture_bonus
  }: BuildingLaunchUpgradeCommand): Promise<BuildingEntity> {
    const is_building_in_progress = await this.repository.exists({
      city_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    const reduced_duration = Math.ceil(duration * (1 - architecture_bonus))

    return building.launchUpgrade(reduced_duration)
  }

  async finishUpgrade({ city_id }: BuildingFinishUpgradesCommand): Promise<void> {
    const building_to_finish = await this.repository.findOne({
      city_id,
      upgrade_at: { $lte: now() }
    })
    if (!building_to_finish) {
      return
    }

    const finished_building = building_to_finish.finishUpgrade()
    await this.repository.updateOne(finished_building)
  }
}
