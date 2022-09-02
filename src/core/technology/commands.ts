import { BuildingQueries } from '../building/queries'
import { CityCommands } from '../city/commands'
import { CityQueries } from '../city/queries'
import { Factory } from '../factory'
import { PricingQueries } from '../pricing/queries'
import { TechnologyCode } from './domain/constants'
import { TechnologyErrors } from './domain/errors'
import { TechnologyEventCode } from './domain/events'
import { TechnologyRepository } from './repository'
import { TechnologyService } from './domain/service'
import { now } from '../shared/time'

interface TechnologyLaunchResearchCommand {
  code: TechnologyCode
  player_id: string
  city_id: string
  duration: number
}

interface TechnologyInitCommand {
  player_id: string
}

interface TechnologyFinishResearchesCommand {
  player_id: string
}

export class TechnologyCommands {
  private repository: TechnologyRepository
  private service: TechnologyService
  private building_queries: BuildingQueries

  constructor({
    repository,
    service,
    building_queries,
  }: {
    repository: TechnologyRepository
    service: TechnologyService
    building_queries: BuildingQueries
  }) {
    this.repository = repository
    this.service = service
    this.building_queries = building_queries
  }

  async init({ player_id }: TechnologyInitCommand): Promise<void> {
    const has_technologies = await this.repository.exists({ player_id })

    const technologies = this.service.initTechnologies({
      player_id,
      has_technologies
    })

    await Promise.all(
      technologies.map((technology) => this.repository.create(technology))
    )
  }

  async requestResearch({ code, city_id, player_id }: { code: TechnologyCode, city_id: string, player_id: string }): Promise<void> {
    const is_technology_in_progress = await this.repository.exists({
      player_id,
      research_time: {
        $exists: true,
        $ne: null
      }
    })

    if (is_technology_in_progress) {
      throw new Error(TechnologyErrors.ALREADY_IN_PROGRESS)
    }

    const technology = await this.repository.findOne({ code, city_id })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    Factory.getEventBus().emit(TechnologyEventCode.RESEARCH_REQUESTED, {
      city_id,
      code,
      current_level: technology.level
    })
  }

  async launchResearch({ code, player_id, city_id, duration }: TechnologyLaunchResearchCommand): Promise<void> {
    const technology = await this.repository.findOne({ code, player_id })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    const research_level = await this.building_queries.getResearchLevel({ city_id })
    const result = this.service.launchResearch({
      research_level,
      technology,
      duration
    })

    await this.repository.updateOne(result.technology)
    Factory.getEventBus().emit(TechnologyEventCode.RESEARCH_LAUNCHED, { code })
  }

  async finishResearches({ player_id }: TechnologyFinishResearchesCommand): Promise<boolean> {
    const technology_to_finish = await this.repository.findOne({
      player_id,
      research_time: {
        $lte: now()
      }
    })

    if (!technology_to_finish) {
      return false
    }

    const finished_technology = technology_to_finish.finishResearch()

    await this.repository.updateOne(finished_technology)
    console.log(`${finished_technology.code} research done`)

    return true
  }
}
