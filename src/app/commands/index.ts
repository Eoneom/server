import { BuildingCode } from '../../core/building/domain/constants'
import { BuildingErrors } from '../../core/building/domain/errors'
import { CityErrors } from '../../core/city/domain/errors'
import { Factory } from '../../core/factory'
import { Modules } from '../../core/modules'
import { PlayerErrors } from '../../core/player/domain/errors'

export class AppCommands {
  private modules: Modules

  constructor() {
    this.modules = Factory.getModules()
  }

  async signup({
    player_name,
    city_name
  }: {
    player_name: string
    city_name: string
  }): Promise<{ player_id: string; city_id: string }> {
    const can_create_player = await this.modules.player.queries.canCreate({ name: player_name })
    if (!can_create_player) {
      throw new Error(PlayerErrors.ALREADY_EXISTS)
    }

    const can_create_city = await this.modules.city.queries.canSettle({ name: city_name })
    if (!can_create_city) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const { player_id } = await this.modules.player.commands.init({ name: player_name })
    const { city_id } = await this.modules.city.commands.settle({ name: city_name, player_id })
    await this.modules.building.commands.init({ city_id })
    await this.modules.technology.commands.init({ player_id })

    return { player_id, city_id }
  }

  async upgradeBuilding({
    player_id,
    city_id,
    building_code
  }: {
    player_id: string
    city_id: string
    building_code: BuildingCode
  }): Promise<void> {
    const city = await this.modules.city.queries.findByIdOrThrow(city_id)
    const is_city_owned_by_player = city.isOwnedBy(player_id)
    if (!is_city_owned_by_player) {
      throw new Error(CityErrors.NOT_OWNER)
    }

    const can_upgrade_building = await this.modules.building.queries.canUpgrade({ city_id })
    if (!can_upgrade_building) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    const building = await this.modules.building.queries.findOneOrThrow({ city_id, code: building_code })
    const building_costs = await this.modules.pricing.queries.getNextLevelCost({ level: building.level, code: building_code })

    await this.modules.city.commands.purchase({ city, cost: building_costs.resource })
    await this.modules.building.commands.launchUpgrade({ building, duration: building_costs.duration })
  }

  async refresh({
    player_id
  }: {
    player_id: string
  }): Promise<void> {
    const cities = await this.modules.city.queries.find({ player_id })

    const gather_resources = cities.map(city => this.modules.city.commands.gatherResources({ city, gather_at_time: new Date().getTime()}))
    const finish_building_upgrades = cities.map(city => this.modules.building.commands.finishUpgrade({ city_id: city.id }))
    const finish_technology_researches = this.modules.technology.commands.finishResearch({ player_id })

    await Promise.all([ ...gather_resources, ...finish_building_upgrades, finish_technology_researches ])
  }
}
