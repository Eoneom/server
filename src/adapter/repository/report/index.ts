import { ReportEntity } from '#core/communication/report.entity'
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

  async list({ player_id }: { player_id: string }): Promise<ReportEntity[]> {
    const reports = await this.model.find({ player_id }).sort({ recorded_at: -1 })
    return reports.map(report => this.buildFromModel(report))
  }

  protected buildFromModel(document: ReportDocument): ReportEntity {
    return ReportEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      type: document.type,
      troups: document.troups,
      origin: document.origin,
      destination: document.destination,
      recorded_at: document.recorded_at,
      was_read: document.was_read
    })
  }
}
