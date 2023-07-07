import { CityErrors } from '../../city/domain/errors'
import { Factory } from '../../factory'
import { Modules } from '../../modules'
import { PlayerErrors } from '../../player/domain/errors'

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
}
