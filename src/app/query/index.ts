import { BuildingEntity } from '../../core/building/domain/entity'
import { CityEntity } from '../../core/city/domain/entity'
import { Factory } from '../../core/factory'
import { Modules } from '../../core/modules'
import { PlayerEntity } from '../../core/player/domain/entity'
import { TechnologyEntity } from '../../core/technology/domain/entity'

export class AppQueries {
  private modules: Modules

  constructor() {
    this.modules = Factory.getModules()
  }

  async sync({
    player_id
  }: {
    player_id: string
  }): Promise<{
    player: PlayerEntity,
    cities: CityEntity[],
    buildings: Record<string, BuildingEntity[]>,
    technologies: TechnologyEntity[]
  }> {

    const [ player, cities, technologies ] = await Promise.all([
      this.modules.player.queries.findByIdOrThrow(player_id),
      this.modules.city.queries.find({ player_id }),
      this.modules.technology.queries.getTechnologies({ player_id })
    ])

    const buildings: Record<string, BuildingEntity[]> = {}
    for (const city of cities) {
      buildings[city.id] = await this.modules.building.queries.getBuildings({ city_id: city.id })
    }

    return {
      player,
      cities,
      technologies,
      buildings
    }
  }
}
