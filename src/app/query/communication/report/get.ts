import { GenericQuery } from '#query/generic'
import { ReportEntity } from '#core/communication/report.entity'
import { CommunicationError } from '#core/communication/error'

export interface CommunicationGetReportQueryRequest {
  player_id: string
  report_id: string
}

export interface CommunicationGetReportQueryResponse {
  report: ReportEntity
}

export class CommunicationGetReportQuery extends GenericQuery<CommunicationGetReportQueryRequest, CommunicationGetReportQueryResponse> {
  async get({
    player_id,
    report_id
  }: CommunicationGetReportQueryRequest): Promise<CommunicationGetReportQueryResponse> {
    const report = await this.repository.report.getById(report_id)
    if (!report.isOwnedBy(player_id)) {
      throw new Error(CommunicationError.REPORT_NOT_OWNER)
    }

    return { report }
  }
}
