import { BuildingQueries } from '../building/queries'
import { CityCommands } from '../city/commands'
import { CityQueries } from '../city/queries'
import { TechnologyCode } from './domain/constants'
import { TechnologyErrors } from './domain/errors'
import { TechnologyRepository } from './repository'
import { TechnologyService } from './domain/service'
import { now } from '../shared/time'

interface TechnologyLaunchResearchCommand {
  code: TechnologyCode
  player_id: string
  city_id: string
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
  private city_queries: CityQueries
  private city_commands: CityCommands
  private building_queries: BuildingQueries

  constructor({
    repository,
    service,
    city_queries,
    city_commands,
    building_queries
  }: {
    repository: TechnologyRepository
    service: TechnologyService
    city_queries: CityQueries,
    city_commands: CityCommands,
    building_queries: BuildingQueries
  }) {
    this.repository = repository
    this.service = service
    this.city_queries = city_queries
    this.city_commands = city_commands
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

  async launchResearch({ code, player_id, city_id }: TechnologyLaunchResearchCommand): Promise<void> {
    const technology = await this.repository.findOne({ code, player_id })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    const is_technology_in_progress = await this.repository.exists({
      player_id,
      research_time: {
        $exists: true,
        $ne: null
      }
    })

    const costs = this.service.getCostsForResearch(technology)
    const has_enough_resources = await this.city_queries.hasResources({ id: city_id, ...costs })
    const research_level = await this.building_queries.getResearchLevel({ city_id })

    const result = this.service.launchResearch({
      is_technology_in_progress,
      has_enough_resources,
      research_level,
      technology
    })

    await this.city_commands.purchase({
      id: city_id,
      costs
    })

    await this.repository.updateOne(result.technology)
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
