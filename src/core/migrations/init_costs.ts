import {
  building_costs,
  building_upgrade_durations_in_second,
  technology_costs,
  technology_research_durations_in_second
} from './constants'

import { App } from '../app'
import { BuildingCode } from '../building/domain/constants'
import { TechnologyCode } from '../technology/domain/constants'

export const init_costs = async (app: App): Promise<void> => {
  Object.keys(building_costs).forEach(code => {
    const costs_for_building = building_costs[code as BuildingCode]
    const duration_for_building = building_upgrade_durations_in_second[code as BuildingCode]
    Object.keys(costs_for_building).forEach(level => {
      const int_level = Number.parseInt(level, 10)

      app.pricing.commands.createBulkLevelCost([ {
        code,
        level: int_level,
        resource: costs_for_building[int_level],
        duration: duration_for_building[int_level]
      } ])
    })
  })

  Object.keys(technology_costs).forEach(code => {
    const costs_for_technology = technology_costs[code as TechnologyCode]
    const duration_for_technology = technology_research_durations_in_second[code as TechnologyCode]
    Object.keys(costs_for_technology).forEach(level => {
      const int_level = Number.parseInt(level, 10)

      app.pricing.commands.createBulkLevelCost([ {
        code,
        level: int_level,
        resource: costs_for_technology[int_level],
        duration: duration_for_technology[int_level]
      } ])
    })
  })
}
