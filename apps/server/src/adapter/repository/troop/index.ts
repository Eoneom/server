import { TroopEntity } from '#core/troop/entity'
import { TroopRepository } from '#app/port/repository/troop'
import {
  TroopDocument,
  TroopModel
} from '#adapter/repository/troop/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { TroopCode } from '#core/troop/constant/code'
import { TroopError } from '#core/troop/error'

export class MongoTroopRepository
  extends MongoGenericRepository<typeof TroopModel, TroopDocument, TroopEntity>
  implements TroopRepository {

  constructor() {
    super(TroopModel, TroopError.NOT_FOUND)
  }

  async getById(id: string): Promise<TroopEntity> {
    return this.findByIdOrThrow(id)
  }

  async listByMovement({ movement_id }: { movement_id: string }): Promise<TroopEntity[]> {
    return this.find({ movement_id })
  }

  async getInProgress({ cell_id }: { cell_id: string }): Promise<TroopEntity | null> {
    return this.findOne({
      cell_id,
      ongoing_recruitment: {
        $exists: true,
        $ne: null
      }
    })
  }

  async listInCell({
    cell_id,
    player_id
  }: { cell_id: string; player_id: string }): Promise<TroopEntity[]> {
    return this.find({
      cell_id,
      player_id
    })
  }


  async getInCell({
    cell_id,
    code
  }: { cell_id: string; code: TroopCode }): Promise<TroopEntity> {
    return this.findOneOrThrow({
      cell_id,
      code
    })
  }

  async isInProgress({ cell_id }: { cell_id: string }): Promise<boolean> {
    return this.exists({
      cell_id,
      ongoing_recruitment: {
        $exists: true,
        $ne: null
      }
    })
  }

  protected buildFromModel(document: TroopDocument): TroopEntity {
    return TroopEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      cell_id: document.cell_id ? document.cell_id.toString() : null,
      code: document.code,
      count: document.count,
      movement_id: document.movement_id ? document.movement_id.toString() : null,
      ongoing_recruitment: document.ongoing_recruitment ? {
        remaining_count: document.ongoing_recruitment.remaining_count,
        finish_at: document.ongoing_recruitment.finish_at,
        last_progress: document.ongoing_recruitment.last_progress,
        started_at: document.ongoing_recruitment.started_at
      } : null
    })
  }
}
