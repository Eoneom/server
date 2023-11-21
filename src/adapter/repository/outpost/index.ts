import { OutpostEntity } from '#core/outpost/entity'
import { OutpostRepository } from '#app/port/repository/outpost'
import {
  OutpostDocument,
  OutpostModel
} from '#adapter/repository/outpost/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { OutpostError } from '#core/outpost/error'

export class MongoOutpostRepository
  extends MongoGenericRepository<typeof OutpostModel, OutpostDocument, OutpostEntity>
  implements OutpostRepository {

  constructor() {
    super(OutpostModel, OutpostError.NOT_FOUND)
  }

  async getById(id: string): Promise<OutpostEntity> {
    return this.findByIdOrThrow(id)
  }

  async existsOnCell({ cell_id }: { cell_id: string }): Promise<boolean> {
    return this.exists({ cell_id })
  }

  async list({ player_id }: { player_id: string }): Promise<OutpostEntity[]> {
    return this.find({ player_id })
  }

  protected buildFromModel(document: OutpostDocument): OutpostEntity {
    return OutpostEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      cell_id: document.cell_id.toString(),
      type: document.type
    })
  }
}
