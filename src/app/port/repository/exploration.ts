import { GenericRepository } from '#app/port/repository/generic'
import { ExplorationEntity } from '#core/world/exploration.entity'

export type ExplorationRepository = GenericRepository<ExplorationEntity> & {
  getCells(query: { player_id: string }): Promise<ExplorationEntity>
}
