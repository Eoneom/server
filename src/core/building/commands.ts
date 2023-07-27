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

}
