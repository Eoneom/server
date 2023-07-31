import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { PlayerEntity } from '#core/player/entity'
import { TechnologyEntity } from '#core/technology/entity'
import { Factory } from '#app/factory'
import { LevelCostValue } from '#core/pricing/values/level'
import { PricingService } from '#core/pricing/service'

export interface ListBuildingQueryResponse {
  buildings: BuildingEntity[],
  costs: Record<string, LevelCostValue>
 }

export class Queries {
  static async authorize({ token }: {
    token: string
  }): Promise<{ player_id: string }> {
    const repository = Factory.getRepository()
    const auth = await repository.auth.findOneOrThrow({ token })
    return { player_id: auth.player_id.toString() }
  }

  static async sync({ player_id }: {
    player_id: string
  }): Promise<{
    player: PlayerEntity,
    cities: CityEntity[],
    technologies: TechnologyEntity[]
  }> {
    const repository = Factory.getRepository()

    const [
      player,
      cities,
      technologies
    ] = await Promise.all([
      repository.player.findByIdOrThrow(player_id),
      repository.city.find({ player_id }),
      repository.technology.find({ player_id })
    ])

    return {
      player,
      cities,
      technologies
    }
  }

  static async listBuildings({ city_id }: { city_id: string }): Promise<ListBuildingQueryResponse> {
    const repository = Factory.getRepository()
    const buildings = await repository.building.find({ city_id })
    const costs = buildings.reduce((acc, building) => {
      const cost = PricingService.getBuildingLevelCost({
        code: building.code,
        level: building.level + 1
      })

      return {
        ...acc,
        [building.id]: cost
      }
    }, {} as Record<string, LevelCostValue>)

    return {
      buildings,
      costs
    }
  }
}
