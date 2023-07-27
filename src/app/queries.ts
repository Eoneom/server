import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { PlayerEntity } from '#core/player/entity'
import { TechnologyEntity } from '#core/technology/entity'
import { Repository } from '#app/repository/generic'

export class Queries {
  private repository: Repository

  constructor({ repository }: { repository: Repository }) {
    this.repository = repository
  }

  async authorize({ token }: {
    token: string
  }): Promise<{ player_id: string }> {
    const auth = await this.repository.auth.findOneOrThrow({ token })
    return { player_id: auth.player_id.toString() }
  }

  async sync({ player_id }: {
    player_id: string
  }): Promise<{
    player: PlayerEntity,
    cities: CityEntity[],
    buildings: Record<string, BuildingEntity[]>,
    technologies: TechnologyEntity[]
  }> {
    const [
      player,
      cities,
      technologies
    ] = await Promise.all([
      this.repository.player.findByIdOrThrow(player_id),
      this.repository.city.find({ player_id }),
      this.repository.technology.find({ player_id })
    ])

    const buildings: Record<string, BuildingEntity[]> = {}
    for (const city of cities) {
      buildings[city.id] = await this.repository.building.find({ city_id: city.id })
    }

    return {
      player,
      cities,
      technologies,
      buildings
    }
  }
}
