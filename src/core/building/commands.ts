import { BuildingCreateParams, BuildingRepository } from './repository'

import { BuildingCode } from './constants'
import { BuildingErrors } from './errors'

export interface BuildingCreateCommand {
  code: BuildingCode
  city_id: string
  level: number
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
}
