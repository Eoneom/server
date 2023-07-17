import { TechnologyCode } from 'src/core/technology/domain/constants'
import { BuildingCode } from '../../core/building/domain/constants'
import { Factory } from '../../core/factory'
import { Modules } from '../../core/modules'
import { Repository } from '../../shared/repository'

export class AppCommands {
  private modules: Modules
  private repository: Repository

  constructor() {
    this.modules = Factory.getModules()
    this.repository = Factory.getRepository()
  }

  async signup({
    player_name,
    city_name
  }: {
    player_name: string
    city_name: string
  }): Promise<{ player_id: string; city_id: string }> {
    const player = await this.modules.player.commands.init({ name: player_name })
    const city = await this.modules.city.commands.settle({ name: city_name, player_id: player.id })
    const buildings = this.modules.building.commands.init({ city_id: city.id })
    const technologies = await this.modules.technology.commands.init({ player_id: player.id })

    await Promise.all([
      this.repository.player.create(player),
      this.repository.city.create(city),
      ...buildings.map(building => this.repository.building.create(building)),
      ...technologies.map(technology => this.repository.technology.create(technology))
    ])

    return {
      player_id: player.id,
      city_id: city.id
    }
  }

  async upgradeBuilding({
    player_id,
    city_id,
    building_code
  }: {
    player_id: string
    city_id: string
    building_code: BuildingCode
  }): Promise<void> {
    const [ city, building ] = await Promise.all([
      this.modules.city.queries.findByIdOrThrow(city_id),
      this.modules.building.queries.findOneOrThrow({ city_id, code: building_code })
    ])
    const building_costs = await this.modules.pricing.queries.getNextLevelCost({ level: building.level, code: building_code })

    const updated_city = await this.modules.city.commands.purchase({ player_id, city, cost: building_costs.resource })
    const updated_building = await this.modules.building.commands.launchUpgrade({ city_id, building, duration: building_costs.duration })

    await Promise.all([
      this.repository.city.updateOne(updated_city),
      this.repository.building.updateOne(updated_building)
    ])
  }

  async researchTechnology({
    player_id,
    city_id,
    technology_code
  }: {
    player_id: string
    city_id: string
    technology_code: TechnologyCode
  }): Promise<void> {
    const [ city, research_lab, technology ] = await Promise.all([
      this.modules.city.queries.findByIdOrThrow(city_id),
      this.modules.building.queries.findOneOrThrow({ city_id, code: BuildingCode.RESEARCH_LAB }),
      this.modules.technology.queries.findOneOrThrow({ player_id, code: technology_code })
    ])

    const technology_costs = await this.modules.pricing.queries.getNextLevelCost({ level: technology.level, code: technology_code })

    const updated_city = await this.modules.city.commands.purchase({ player_id, city, cost: technology_costs.resource })
    const updated_technology = await this.modules.technology.commands.launchResearch({
      player_id,
      technology,
      duration: technology_costs.duration,
      research_lab_level: research_lab.level
    })

    await Promise.all([
      this.repository.city.updateOne(updated_city),
      this.repository.technology.updateOne(updated_technology)
    ])
  }

  async refresh({
    player_id
  }: {
    player_id: string
  }): Promise<void> {
    const cities = await this.modules.city.queries.find({ player_id })

    const gather_resources = cities.map(async city => {
      const earnings_by_second = await this.modules.building.queries.getEarningsBySecond({ city_id: city.id })
      return this.modules.city.commands.gatherResources({ city, gather_at_time: new Date().getTime(), earnings_by_second})
    })
    const finish_building_upgrades = cities.map(city => this.modules.building.commands.finishUpgrade({ city_id: city.id }))
    const finish_technology_researches = this.modules.technology.commands.finishResearch({ player_id })

    await Promise.all([ ...gather_resources, ...finish_building_upgrades, finish_technology_researches ])
  }
}
