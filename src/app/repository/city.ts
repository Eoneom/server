import { CityEntity } from '#core/city/entity'
import { GenericRepository } from '#app/repository/generic'

export type CityRepository = GenericRepository<CityEntity> & {
  get(id: string): Promise<CityEntity>
  list (query: { player_id: string }): Promise<CityEntity[]>
  exist (name: string): Promise<boolean>
}
