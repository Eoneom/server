import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { PlayerEntity } from '#core/player/entity'
import { TechnologyEntity } from '#core/technology/entity'
import { Factory } from '#app/factory'
import { LevelCostValue } from '#core/pricing/value/level'
import { PricingService } from '#core/pricing/service'
import { TechnologyCode } from '#core/technology/constants'
import { BuildingCode } from '#core/building/constants'
import { AppService } from '#app/service'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'

export interface SyncQueryResponse {
  player: PlayerEntity
  cities: CityEntity[],
  earnings_per_second_by_city: Record<string, { plastic: number, mushroom: number}>
}

export interface ListBuildingQueryResponse {
  buildings: BuildingEntity[],
  costs: Record<string, LevelCostValue>
}

export interface ListTechnologyQueryResponse {
  technologies: TechnologyEntity[]
  costs: Record<string, LevelCostValue>
  requirements: Record<TechnologyCode, RequirementValue>
}

export class Queries {
  static async authorize({ token }: {
    token: string
  }): Promise<{ player_id: string }> {
    const repository = Factory.getRepository()
    const auth = await repository.auth.findOneOrThrow({ token })
    return { player_id: auth.player_id.toString() }
  }

  static async sync({ player_id }: {player_id: string }): Promise<SyncQueryResponse> {
    const repository = Factory.getRepository()

    const [
      player,
      cities,
    ] = await Promise.all([
      repository.player.findByIdOrThrow(player_id),
      repository.city.find({ player_id })
    ])

    const earnings_per_second = await Promise.all(cities.map(async city => {
      const earnings = await AppService.getCityEarningsBySecond({ city_id: city.id })
      return {
        city_id: city.id,
        ...earnings
      }
    }))

    const earnings_per_second_by_city = earnings_per_second.reduce((acc, earnings) => {
      return {
        ...acc,
        [earnings.city_id]: {
          plastic: earnings.plastic,
          mushroom: earnings.mushroom
        }
      }
    }, {} as Record<string, { plastic: number, mushroom: number }>)

    return {
      player,
      cities,
      earnings_per_second_by_city
    }
  }

  static async listBuildings({
    city_id, player_id
  }: { city_id: string, player_id: string }): Promise<ListBuildingQueryResponse> {
    const repository = Factory.getRepository()
    const buildings = await repository.building.find({ city_id })
    const architecture = await repository.technology.findOneOrThrow({
      player_id,
      code: TechnologyCode.ARCHITECTURE
    })
    const costs = buildings.reduce((acc, building) => {
      const cost = PricingService.getBuildingLevelCost({
        code: building.code,
        level: building.level + 1,
        architecture_level: architecture.level
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

  static async listTechnologies({
    player_id,
    city_id
  }: {
    player_id: string,
    city_id: string
  }): Promise<ListTechnologyQueryResponse> {
    const repository = Factory.getRepository()
    const technologies = await repository.technology.find({ player_id })
    const research_lab = await repository.building.findOneOrThrow({
      city_id,
      code: BuildingCode.RESEARCH_LAB
    })
    const costs = technologies.reduce((acc, technology) => {
      const cost = PricingService.getTechnologyLevelCost({
        code: technology.code,
        level: technology.level + 1,
        research_lab_level: research_lab.level
      })

      return {
        ...acc,
        [technology.id]: cost
      }
    }, {} as Record<string, LevelCostValue>)

    const requirements = RequirementService.listTechnologyRequirements()

    return {
      technologies,
      costs,
      requirements
    }
  }
}
