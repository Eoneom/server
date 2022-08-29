import { BuildingEntity } from "../building/domain/entity"
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './repository'
import { FilterQuery } from '../../types/database'
import { SIZE_PER_CELL } from './domain/constants'
import { now } from '../shared/time'

export class CityQueries {
  private repository: CityRepository

  public constructor(repository: CityRepository) {
    this.repository = repository
  }

  public async hasResources(query: { city_id: string, wood: number }): Promise<boolean> {
    console.log('CityQueries.hasResources')
    const city = await this.repository.findById(query.city_id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    return city.wood >= query.wood
  }

  public async findOne(query: FilterQuery<CityEntity>): Promise<CityEntity | null> {
    console.log('CityQueries.findOne')
    return this.repository.findOne(query)
  }

  public async findByIdOrThrow(id: string): Promise<CityEntity> {
    console.log('CityQueries.findByIdOrThrow')
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    return city
  }

  public async hasSizeToBuild(id: string): Promise<boolean> {
    return true
  }
}

export const getSecondsSinceLastWoodGather = (city: CityEntity): number => {
  const now_in_seconds = now()
  return Math.floor((now_in_seconds - city.last_wood_gather) / 1000)
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

export const getTotalBuildingLevels = (city: CityEntity): number => {
  return Object.values(city.buildings).reduce((sum, building) => sum + building.level, 0)
}

export const getMaxSize = (city: CityEntity): number => {
  return city.cells.length * SIZE_PER_CELL
}
