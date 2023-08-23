import { TroupEntity } from '#core/troup/entity'
import { TroupRepository } from '#app/port/repository/troup'
import {
  TroupDocument, TroupModel
} from '#adapter/repository/troup/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { TroupCode } from '#core/troup/constant'
import { TroupError } from '#core/troup/error'

export class MongoTroupRepository
  extends MongoGenericRepository<typeof TroupModel, TroupDocument, TroupEntity>
  implements TroupRepository {

  constructor() {
    super(TroupModel, TroupError.NOT_FOUND)
  }

  async getInCity({
    city_id,
    code
  }: {
    city_id: string;
    code: TroupCode
  }): Promise<TroupEntity> {
    return this.findOneOrThrow({
      city_id,
      code
    })
  }

  async isInProgress({ city_id }: { city_id: string }): Promise<boolean> {
    return this.exists({
      city_id,
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
      city_id: document.city_id?.toString() ?? null,
      code: document.code,
      count: document.count,
      ongoing_recruitment: document.ongoing_recruitment ?{
        remaining_count: document.ongoing_recruitment.remaining_count,
        finish_at: document.ongoing_recruitment.finish_at
      } : null
    })
  }
}
