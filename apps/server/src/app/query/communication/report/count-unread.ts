import { GenericQuery } from '#query/generic'

export interface CommunicationCountUnreadReportQueryRequest {
  player_id: string
}

export interface CommunicationCountUnreadReportQueryResponse {
  count: number
}

export class CommunicationCountUnreadReportQuery extends GenericQuery<CommunicationCountUnreadReportQueryRequest, CommunicationCountUnreadReportQueryResponse> {
  constructor() {
    super({ name: 'communication:report:count-unread' })
  }

  protected async get({ player_id }: CommunicationCountUnreadReportQueryRequest): Promise<CommunicationCountUnreadReportQueryResponse> {
    const count = await this.repository.report.count({
      player_id,
      was_read: false
    })

    return { count }
  }
}
