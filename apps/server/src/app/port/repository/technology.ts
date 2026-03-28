import { TechnologyEntity } from '#core/technology/entity'
import { GenericRepository } from '#app/port/repository/generic'
import { TechnologyCode } from '#core/technology/constant/code'

export type TechnologyRepository = GenericRepository<TechnologyEntity> & {
  get(query: { player_id: string, code: TechnologyCode }): Promise<TechnologyEntity>
  getLevel(query: { player_id: string, code: TechnologyCode }): Promise<number>
  getInProgress(query: { player_id: string }): Promise<TechnologyEntity | null>
  getResearchDone(query: { player_id: string }): Promise<TechnologyEntity | null>

  list(query: {
    player_id: string,
    codes?: TechnologyCode[]
  }): Promise<TechnologyEntity[]>
  isInProgress(query: { player_id: string }): Promise<boolean>
}
