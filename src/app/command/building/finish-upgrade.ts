import { GenericCommand } from '#command/generic'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import assert from 'assert'

export interface BuildingFinishUpgradeRequest {
  player_id: string
  city_id: string
}

interface BuildingFinishUpgradeExec {
  player_id: string
  city: CityEntity
  building_to_finish: BuildingEntity | null
}

interface BuildingFinishUpgradeSave {
  building: BuildingEntity | null
  upgraded_at: number
}

export type BuildingFinishUpgradeCommandResponse = {
  code: BuildingCode
  upgraded_at: number
} | null

export class BuildingFinishUpgradeCommand extends GenericCommand<
  BuildingFinishUpgradeRequest,
  BuildingFinishUpgradeExec,
  BuildingFinishUpgradeSave,
  BuildingFinishUpgradeCommandResponse
> {
  constructor() {
    super({ name: 'building:finish-upgrade' })
  }

  async fetch({
    player_id,
    city_id,
  }: BuildingFinishUpgradeRequest): Promise<BuildingFinishUpgradeExec> {
    const [
      city,
      building_to_finish
    ] = await Promise.all([
      this.repository.city.get(city_id),
      this.repository.building.getUpgradeDone({ city_id })
    ])

    return {
      building_to_finish,
      city,
      player_id
    }
  }

  exec({
    city,
    player_id,
    building_to_finish
  }: BuildingFinishUpgradeExec): BuildingFinishUpgradeSave {
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    if (!building_to_finish) {
      return {
        upgraded_at: 0,
        building: null
      }
    }

    assert(building_to_finish.upgrade_at)

    return {
      upgraded_at: building_to_finish.upgrade_at,
      building: building_to_finish.finishUpgrade()
    }
  }

  async save({
    building, upgraded_at
  }: BuildingFinishUpgradeSave): Promise<BuildingFinishUpgradeCommandResponse> {
    if (!building) {
      return null
    }

    await this.repository.building.updateOne(building)

    return {
      code: building.code,
      upgraded_at
    }
  }
}
