import { Fetcher } from '../../fetcher'
import { CommunicationListReportResponse } from './list-report'

export class CommunicationEndpoint {
  private fetcher: Fetcher

  constructor({ fetcher }: { fetcher: Fetcher }) {
    this.fetcher = fetcher
  }

  public listReport(token: string): Promise<CommunicationListReportResponse> {
    return this.fetcher.get('/communication/report', { token })
  }
}
