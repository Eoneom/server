import { BuildingEntity } from '#core/building/entity'
import { GenericRepository } from '#app/repository/generic'
import { BuildingCode } from '#core/building/constant'

export type BuildingRepository = GenericRepository<BuildingEntity> & {
  list(query: {
    city_id: string,
    codes?: BuildingCode[]
  }): Promise<BuildingEntity[]>

  get(query: { city_id: string, code: BuildingCode }): Promise<BuildingEntity>
  getInProgress(query: { city_id: string }): Promise<BuildingEntity | null>
  getLevel(query: { city_id: string, code: BuildingCode }): Promise<number>
  getUpgradeDone(query: { city_id: string }): Promise<BuildingEntity | null>

  isInProgress(query: { city_id: string }): Promise<boolean>
}
