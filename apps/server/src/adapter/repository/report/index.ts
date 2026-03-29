import { ReportEntity } from '#core/communication/report/entity'
import { ReportRepository } from '#app/port/repository/report'
import {
  ReportDocument,
  ReportModel
} from '#adapter/repository/report/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { CommunicationError } from '#core/communication/error'

export class MongoReportRepository
  extends MongoGenericRepository<typeof ReportModel, ReportDocument, ReportEntity>
  implements ReportRepository {

  constructor() {
    super(ReportModel, CommunicationError.REPORT_NOT_FOUND)
  }

  async count({
    player_id,
    was_read
  }: {
    player_id: string
    was_read: boolean
  }): Promise<number> {
    return this.model.countDocuments({
      player_id,
      was_read
    })
  }

  async getById(id: string): Promise<ReportEntity> {
    return this.findByIdOrThrow(id)
  }

  async list({
    player_id,
    limit,
    offset
  }: {
    player_id: string
    limit: number
    offset: number
  }): Promise<{ reports: ReportEntity[]; total: number }> {
    const filter = { player_id }
    const [documents, total] = await Promise.all([
      this.model.find(filter).sort({ recorded_at: -1 }).skip(offset).limit(limit),
      this.model.countDocuments(filter)
    ])
    return {
      reports: documents.map(report => this.buildFromModel(report)),
      total
    }
  }

  protected buildFromModel(document: ReportDocument): ReportEntity {
    return ReportEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      type: document.type,
      troops: document.troops,
      origin: document.origin,
      destination: document.destination,
      recorded_at: document.recorded_at,
      was_read: document.was_read
    })
  }
}
