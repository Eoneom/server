import { Fetcher } from '../../fetcher'
import {
  CommunicationGetReportRequest,
  CommunicationGetReportResponse
} from './report/get'
import { CommunicationListReportResponse } from './report/list'

export class CommunicationEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public listReport(token: string): Promise<CommunicationListReportResponse> {
    return this.fetcher.get('/communication/report', { token })
  }

  public getReport(token: string, { report_id }: CommunicationGetReportRequest): Promise<CommunicationGetReportResponse> {
    return this.fetcher.get(`/communication/report/${report_id}`, { token })
  }
}
