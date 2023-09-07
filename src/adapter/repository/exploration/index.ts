import { ExplorationEntity } from '#core/world/exploration.entity'
import { ExplorationRepository } from '#app/port/repository/exploration'
import {
  ExplorationDocument,
  ExplorationModel
} from '#adapter/repository/exploration/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { WorldError } from '#core/world/error'

export class MongoExplorationRepository
  extends MongoGenericRepository<typeof ExplorationModel, ExplorationDocument, ExplorationEntity>
  implements ExplorationRepository {

  constructor() {
    super(ExplorationModel, WorldError.EXPLORATION_NOT_FOUND)
  }

  async getCells({ player_id }: { player_id: string }): Promise<ExplorationEntity> {
    return this.findOneOrThrow({ player_id })
  }

  protected buildFromModel(document: ExplorationDocument): ExplorationEntity {
    return ExplorationEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      cell_ids: document.cell_ids.map(cell_id => cell_id.toString())
    })
  }
}
