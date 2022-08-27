import { CityRepository, FindParams } from './repository'
import { SIZE_PER_CELL, wood_camp_costs_by_level, wood_camp_gains_by_level_by_seconds, wood_camp_upgrade_time_in_seconds } from './constants'

import { BuildingCode } from '../building/constants'
import { BuildingEntity } from "../building/entity"
import { CityEntity } from './entity'
import { now } from '../shared/time'

export class CityQueries {
  private repository: CityRepository

  public constructor(repository: CityRepository) {
    this.repository = repository
  }

  public async findOne(query: FindParams): Promise<CityEntity | null> {
    return this.repository.findOne(query)
  }

  public async findById(id: string): Promise<CityEntity | null> {
    return this.repository.findById(id)
  }
}

export const getSecondsSinceLastWoodGather = (city: CityEntity): number => {
  const now_in_seconds = now()
  return Math.floor((now_in_seconds - city.last_wood_gather) / 1000)
}

export const getWoodCostsForUpgrade = (building: BuildingEntity): number => {
  switch (building.code) {
    case BuildingCode.WOOD_CAMP:
      return wood_camp_costs_by_level[building.level + 1] ?? 0
  }

  return 0
}

export const isBuildingUpgradeDone = (building: BuildingEntity): boolean => {
  if (!building.upgrade_time) {
    return true
  }

  return now() - building.upgrade_time > 0
}

export const getBuildingInProgress = (city: CityEntity): BuildingEntity | undefined => {
  return Object.values(city.buildings).find(building => building.upgrade_time)
}

export const getWoodEarningsBySecond = (city: CityEntity): number => {
  const wood_camp = city.buildings[BuildingCode.WOOD_CAMP]
  return wood_camp_gains_by_level_by_seconds[wood_camp.level]
}

export const getWoodUpgradeTimeInSeconds = (city: CityEntity): number => {
  const wood_camp = city.buildings[BuildingCode.WOOD_CAMP]
  return wood_camp_upgrade_time_in_seconds[wood_camp.level + 1]
}

export const getWoodCostForLevel = (level: number): number => {
  return wood_camp_costs_by_level[level]
}

export const isBuildingInProgress = (city: CityEntity): boolean => {
  return Object.values(city.buildings).some(building => building.upgrade_time)
}

export const hasSizeToBuild = (city: CityEntity): boolean => {
  return getTotalBuildingLevels(city) < getMaxSize(city)
}

export const getTotalBuildingLevels = (city: CityEntity): number => {
  return Object.values(city.buildings).reduce((sum, building) => sum + building.level, 0)
}

export const getMaxSize = (city: CityEntity): number => {
  return city.cells.length * SIZE_PER_CELL
}
