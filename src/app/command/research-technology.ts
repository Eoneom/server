import { GenericCommand } from '#app/command/generic'
import { BuildingCode } from '#core/building/domain/constants'
import { CityEntity } from '#core/city/domain/entity'
import { CityService } from '#core/city/domain/service'
import { LevelCostEntity } from '#core/pricing/domain/entities/level'
import { TechnologyEntity } from '#core/technology/domain/entity'
import { TechnologyService } from '#core/technology/domain/service'

interface ResearchTechnologyCommandRequest {
  player_id: string
  city_id: string
  technology_code: string
}

interface ResearchTechnologyExec {
  player_id: string
  city: CityEntity
  technology_costs: LevelCostEntity
  technology: TechnologyEntity
  research_lab_level: number
}

interface ResearchTechnologySave {
  city: CityEntity
  technology: TechnologyEntity
}

export class ResearchTechnologyCommand extends GenericCommand<ResearchTechnologyCommandRequest, ResearchTechnologyExec, ResearchTechnologySave> {
  async fetch({
    city_id, player_id, technology_code
  }: ResearchTechnologyCommandRequest): Promise<ResearchTechnologyExec> {
    const [
      city,
      research_lab,
      technology
    ] = await Promise.all([
      this.repository.city.findByIdOrThrow(city_id),
      this.repository.building.findOneOrThrow({
        city_id,
        code: BuildingCode.RESEARCH_LAB
      }),
      this.repository.technology.findOneOrThrow({
        player_id,
        code: technology_code
      })
    ])

    const technology_costs = await this.repository.level_cost.getNextLevelCost({
      level: technology.level,
      code: technology_code
    })

    return {
      player_id,
      city,
      technology_costs,
      technology,
      research_lab_level: research_lab.level
    }
  }

  exec({
    player_id,
    city,
    technology_costs,
    technology,
    research_lab_level,
    is_technology_in_progress
  }: {
    player_id: string
    city: CityEntity
    technology_costs: LevelCostEntity
    technology: TechnologyEntity
    research_lab_level: number
    is_technology_in_progress: boolean
  }): ResearchTechnologySave {
    const city_service = new CityService()
    const technology_service = new TechnologyService()
    const updated_city = city_service.purchase({
      player_id,
      city,
      cost: technology_costs.resource
    })
    const updated_technology = technology_service.launchResearch({
      is_technology_in_progress,
      technology,
      duration: technology_costs.duration,
      research_lab_level
    })
    return {
      city: updated_city,
      technology: updated_technology
    }
  }

  async save({
    city, technology
  }: ResearchTechnologySave): Promise<void>{
    await Promise.all([
      this.repository.city.updateOne(city),
      this.repository.technology.updateOne(technology)
    ])
  }
}
