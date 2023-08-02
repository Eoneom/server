import { GenericCommand } from '#app/command/generic'
import { BuildingCode } from '#core/building/constants'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { PricingService } from '#core/pricing/service'
import { TechnologyCode } from '#core/technology/constants'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyService } from '#core/technology/service'
import assert from 'assert'

export interface ResearchTechnologyRequest {
  player_id: string
  city_id: string
  technology_code: TechnologyCode
}

interface ResearchTechnologyExec {
  player_id: string
  city: CityEntity
  technology: TechnologyEntity
  research_lab_level: number
  is_technology_in_progress: boolean
}

interface ResearchTechnologySave {
  city: CityEntity
  technology: TechnologyEntity
}

export interface ResearchTechnologyResponse {
  research_at: number
}

export class ResearchTechnologyCommand extends GenericCommand<
  ResearchTechnologyRequest,
  ResearchTechnologyExec,
  ResearchTechnologySave,
  ResearchTechnologyResponse
> {
  async fetch({
    city_id, player_id, technology_code
  }: ResearchTechnologyRequest): Promise<ResearchTechnologyExec> {
    const [
      city,
      research_lab,
      technology,
      is_technology_in_progress
    ] = await Promise.all([
      this.repository.city.findByIdOrThrow(city_id),
      this.repository.building.findOneOrThrow({
        city_id,
        code: BuildingCode.RESEARCH_LAB
      }),
      this.repository.technology.findOneOrThrow({
        player_id,
        code: technology_code
      }),
      this.repository.technology.exists({
        player_id,
        research_at: {
          $exists: true,
          $ne: null
        }
      })
    ])

    return {
      player_id,
      city,
      technology,
      is_technology_in_progress,
      research_lab_level: research_lab.level
    }
  }

  exec({
    player_id,
    city,
    technology,
    research_lab_level,
    is_technology_in_progress
  }: ResearchTechnologyExec): ResearchTechnologySave {
    const technology_costs = PricingService.getTechnologyLevelCost({
      code: technology.code,
      level: technology.level + 1,
      research_lab_level
    })
    const updated_city = CityService.purchase({
      player_id,
      city,
      cost: technology_costs.resource
    })
    const updated_technology = TechnologyService.launchResearch({
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
  }: ResearchTechnologySave): Promise<ResearchTechnologyResponse>{
    await Promise.all([
      this.repository.city.updateOne(city),
      this.repository.technology.updateOne(technology)
    ])

    assert(technology.research_at)

    return { research_at: technology.research_at }
  }
}
