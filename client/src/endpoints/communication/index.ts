import { Fetcher } from '../../fetcher'
import { CommunicationCountUnreadReportResponse } from './report/count-unread'
import {
  CommunicationGetReportRequest,
  CommunicationGetReportResponse
} from './report/get'
import { CommunicationListReportResponse } from './report/list'
import {
  CommunicationMarkReportRequest, CommunicationMarkReportResponse
} from './report/mark'

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

  public countUnread(token: string): Promise<CommunicationCountUnreadReportResponse> {
    return this.fetcher.get('/communication/report/unread/count', { token })
  }

  public markReport(token: string, body: CommunicationMarkReportRequest): Promise<CommunicationMarkReportResponse> {
    return this.fetcher.put('/communication/report/mark', {
      body,
      token
    })
  }
}
