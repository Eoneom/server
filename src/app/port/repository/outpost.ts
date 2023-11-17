import { GenericRepository } from '#app/port/repository/generic'
import { OutpostEntity } from '#core/outpost/entity'

export type OutpostRepository = GenericRepository<OutpostEntity> & {
  existsOnCell(query: { cell_id: string }): Promise<boolean>

  list(query: { player_id: string }): Promise<OutpostEntity[]>
}
