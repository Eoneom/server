import { TroupEntity } from '#core/troup/entity'
import { TroupRepository } from '#app/port/repository/troup'
import {
  TroupDocument,
  TroupModel
} from '#adapter/repository/troup/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { TroupCode } from '#core/troup/constant/code'
import { TroupError } from '#core/troup/error'

export class MongoTroupRepository
  extends MongoGenericRepository<typeof TroupModel, TroupDocument, TroupEntity>
  implements TroupRepository {

  constructor() {
    super(TroupModel, TroupError.NOT_FOUND)
  }

  async getById(id: string): Promise<TroupEntity> {
    return this.findByIdOrThrow(id)
  }

  async listByMovement({ movement_id }: { movement_id: string }): Promise<TroupEntity[]> {
    return this.find({ movement_id })
  }

  async getInProgress({ cell_id }: { cell_id: string }): Promise<TroupEntity | null> {
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
  }: { cell_id: string; player_id: string }): Promise<TroupEntity[]> {
    return this.find({
      cell_id,
      player_id
    })
  }


  async getInCell({
    cell_id,
    code
  }: { cell_id: string; code: TroupCode }): Promise<TroupEntity> {
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

  protected buildFromModel(document: TroupDocument): TroupEntity {
    return TroupEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      cell_id: document.cell_id ? document.cell_id.toString() : null,
      code: document.code,
      count: document.count,
      movement_id: document.movement_id ? document.movement_id.toString() : null,
      ongoing_recruitment: document.ongoing_recruitment ? {
        remaining_count: document.ongoing_recruitment.remaining_count,
        finish_at: document.ongoing_recruitment.finish_at,
        last_progress: document.ongoing_recruitment.last_progress
      } : null
    })
  }
}
