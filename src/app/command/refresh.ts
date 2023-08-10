import { GenericCommand } from '#app/command/generic'
import { BuildingCode } from '#core/building/constants'
import { BuildingEntity } from '#core/building/entity'
import { BuildingService } from '#core/building/service'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { TechnologyEntity } from '#core/technology/entity'
import { now } from '#shared/time'

export interface RefreshRequest {
  player_id: string
}

type BuildingLevelsByCity = Record<string, { [BuildingCode.RECYCLING_PLANT]: number, [BuildingCode.MUSHROOM_FARM]: number}>

interface RefreshExec {
  cities: CityEntity[]
  building_levels_by_city: BuildingLevelsByCity
  buildings_to_finish: Array<BuildingEntity | null>
  technology_to_finish: TechnologyEntity | null
}

interface RefreshSave {
  cities: Array<CityEntity | null>
  buildings: Array<BuildingEntity | null>
  technology: TechnologyEntity | null
}

export class RefreshCommand extends GenericCommand<
  RefreshRequest,
  RefreshExec,
  RefreshSave
> {
  async fetch({ player_id }: RefreshRequest): Promise<RefreshExec> {
    const cities = await this.repository.city.list({ player_id })
    const buildings_to_finish = await Promise.all(cities.map(city => {
      return this.repository.building.getUpgradeDone({ city_id: city.id })
    }))
    const technology_to_finish = await this.repository.technology.getResearchDone({ player_id })
    const building_levels_with_city_id = await Promise.all(cities.map(async city => {
      const recycling_plant_level = await this.repository.building.getLevel({
        city_id: city.id,
        code: BuildingCode.RECYCLING_PLANT
      })
      const mushroom_farm_level = await this.repository.building.getLevel({
        city_id: city.id,
        code: BuildingCode.MUSHROOM_FARM
      })

      return {
        [BuildingCode.RECYCLING_PLANT]: recycling_plant_level,
        [BuildingCode.MUSHROOM_FARM]: mushroom_farm_level,
        city_id: city.id
      }
    }))

    const building_levels_by_city: BuildingLevelsByCity = building_levels_with_city_id.reduce((acc, current) => {
      return {
        ...acc,
        [current.city_id]: {
          [BuildingCode.MUSHROOM_FARM]: current[BuildingCode.MUSHROOM_FARM],
          [BuildingCode.RECYCLING_PLANT]: current[BuildingCode.RECYCLING_PLANT]
        }
      }
    }, {})

    return {
      cities,
      buildings_to_finish,
      technology_to_finish,
      building_levels_by_city
    }
  }

  exec({
    cities,
    building_levels_by_city,
    buildings_to_finish,
    technology_to_finish
  }: RefreshExec): RefreshSave {
    const updated_cities = cities.map( city => {
      const earnings_by_second = BuildingService.getEarningsBySecond({
        recycling_plant_level: building_levels_by_city[city.id][BuildingCode.RECYCLING_PLANT],
        mushroom_farm_level: building_levels_by_city[city.id][BuildingCode.MUSHROOM_FARM]
      })

      return CityService.gatherResources({
        city,
        gather_at_time: now(),
        earnings_by_second
      })
    })

    const updated_buildings = buildings_to_finish.map(building => building ? building.finishUpgrade(): null)
    const updated_technology = technology_to_finish ? technology_to_finish.finishResearch() : null

    return {
      cities: updated_cities,
      buildings: updated_buildings,
      technology: updated_technology
    }
  }

  async save({
    cities,
    buildings,
    technology
  }: RefreshSave): Promise<void> {
    await Promise.all([
      ...cities.map(city => city && this.repository.city.updateOne(city)),
      ...buildings.map(building => building && this.repository.building.updateOne(building)),
      technology && this.repository.technology.updateOne(technology)
    ])
  }
}
