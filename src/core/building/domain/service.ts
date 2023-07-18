import { BuildingCode, building_earnings } from '#core/building/domain/constants'
import { BuildingEntity } from '#core/building/domain/entity'

export class BuildingService {
  initBuildings({
    city_id
  }: {
    city_id: string
  }): BuildingEntity[] {
    const recycling_plant = BuildingEntity.initRecyclingPlant({ city_id })
    const mushroom_farm = BuildingEntity.initMushroomFarm({ city_id })
    const research_lab = BuildingEntity.initResearchLab({ city_id })

    return [
      recycling_plant,
      mushroom_farm,
      research_lab
    ]
  }

  getEarningsBySecond({
    recycling_plant_level,
    mushroom_farm_level
  }: {
    recycling_plant_level: number,
    mushroom_farm_level: number,
  }): {
    plastic: number,
    mushroom: number
  } {
    return {
      plastic: building_earnings[BuildingCode.RECYCLING_PLANT][recycling_plant_level],
      mushroom: building_earnings[BuildingCode.MUSHROOM_FARM][mushroom_farm_level]
    }
  }
}
