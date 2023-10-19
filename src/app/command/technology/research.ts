import { GenericCommand } from '#command/generic'
import { AppService } from '#app/service'
import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { PricingService } from '#core/pricing/service'
import {
  Levels,
  RequirementService
} from '#core/requirement/service'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'

export interface TechnologyResearchRequest {
  player_id: string
  city_id: string
  technology_code: TechnologyCode
}

export interface TechnologyResearchExec {
  player_id: string
  city: CityEntity
  technology: TechnologyEntity
  research_lab_level: number
  levels: Levels
  is_technology_in_progress: boolean
}

interface TechnologyResearchSave {
  city: CityEntity
  technology: TechnologyEntity
}

export class TechnologyResearchCommand extends GenericCommand<
  TechnologyResearchRequest,
  TechnologyResearchExec,
  TechnologyResearchSave
> {
  constructor() {
    super({ name: 'technology:research' })
  }

  async fetch({
    city_id, player_id, technology_code
  }: TechnologyResearchRequest): Promise<TechnologyResearchExec> {
    const [
      city,
      technology,
      is_technology_in_progress,
      research_lab,
      levels
    ] = await Promise.all([
      this.repository.city.get(city_id),
      this.repository.technology.get({
        player_id,
        code: technology_code
      }),
      this.repository.technology.isInProgress({ player_id }),
      this.repository.building.get({
        city_id,
        code: BuildingCode.RESEARCH_LAB
      }),
      AppService.getTechnologyRequirementLevels({
        city_id,
        player_id,
        technology_code
      })
    ])

    return {
      player_id,
      city,
      technology,
      research_lab_level: research_lab.level,
      levels,
      is_technology_in_progress,
    }
  }

  exec({
    city,
    is_technology_in_progress,
    player_id,
    levels,
    research_lab_level,
    technology,
  }: TechnologyResearchExec): TechnologyResearchSave {
    RequirementService.checkTechnologyRequirement({
      technology_code: technology.code,
      levels,
    })
    const {
      resource,
      duration
    } = PricingService.getTechnologyLevelCost({
      code: technology.code,
      level: technology.level + 1,
      research_lab_level
    })
    const updated_city = city.purchase({
      player_id,
      resource
    })
    const updated_technology = technology.launchResearch({
      is_technology_in_progress,
      duration,
    })

    return {
      city: updated_city,
      technology: updated_technology
    }
  }

  async save({
    city,
    technology
  }: TechnologyResearchSave): Promise<void>{
    await Promise.all([
      this.repository.city.updateOne(city),
      this.repository.technology.updateOne(technology)
    ])
  }
}
