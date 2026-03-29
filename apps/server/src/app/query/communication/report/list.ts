import { GenericQuery } from '#query/generic'
import { ReportEntity } from '#core/communication/report/entity'

export const COMMUNICATION_LIST_REPORT_PAGE_SIZE = 20

export interface CommunicationListReportQueryRequest {
  player_id: string
  page: number
}

export interface CommunicationListReportQueryResponse {
  reports: ReportEntity[]
  total: number
}

const normalizePage = (page: number): number => {
  return typeof page === 'number' && Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

export class CommunicationListReportQuery extends GenericQuery<CommunicationListReportQueryRequest, CommunicationListReportQueryResponse> {
  constructor() {
    super({ name: 'communication:report:list' })
  }

  protected async get({
    player_id,
    page
  }: CommunicationListReportQueryRequest): Promise<CommunicationListReportQueryResponse> {
    const limit = COMMUNICATION_LIST_REPORT_PAGE_SIZE
    const offset = (normalizePage(page) - 1) * limit
    const { reports, total } = await this.repository.report.list({ player_id, limit, offset })
    return { reports, total }
  }
}
