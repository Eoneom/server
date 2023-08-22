import { GenericCommand } from '#command/generic'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'

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
  building: BuildingEntity
}

export class BuildingFinishUpgradeCommand extends GenericCommand<
  BuildingFinishUpgradeRequest,
  BuildingFinishUpgradeExec,
  BuildingFinishUpgradeSave
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
      throw new Error(BuildingError.NOT_IN_PROGRESS)
    }

    return { building: building_to_finish.finishUpgrade() }
  }

  async save({ building }: BuildingFinishUpgradeSave) {
    await this.repository.building.updateOne(building)
  }
}
