import { GenericQuery } from '#query/generic'
import { ReportEntity } from '#core/communication/report.entity'

export interface CommunicationListReportQueryRequest {
  player_id: string
}

export interface CommunicationListReportQueryResponse {
  reports: ReportEntity[]
}

export class CommunicationListReportQuery extends GenericQuery<CommunicationListReportQueryRequest, CommunicationListReportQueryResponse> {
  async get({ player_id }: CommunicationListReportQueryRequest): Promise<CommunicationListReportQueryResponse> {
    const reports = await this.repository.report.list({ player_id })
    return { reports }
  }
}
