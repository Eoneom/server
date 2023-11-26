import { GenericRepository } from '#app/port/repository/generic'
import { OutpostEntity } from '#core/outpost/entity'

export type OutpostRepository = GenericRepository<OutpostEntity> & {
  getById(id: string): Promise<OutpostEntity>

  existsOnCell(query: { cell_id: string }): Promise<boolean>

  countForPlayer(query: { player_id: string }): Promise<number>

  list(query: { player_id: string }): Promise<OutpostEntity[]>
}
