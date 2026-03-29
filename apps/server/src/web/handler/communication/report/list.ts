import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CommunicationListReportDataResponse,
  CommunicationListReportResponse
} from '@eoneom/api-client/src/endpoints/communication/report/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  COMMUNICATION_LIST_REPORT_PAGE_SIZE,
  CommunicationListReportQuery,
  CommunicationListReportQueryResponse
} from '#query/communication/report/list'

const parseListReportPage = (raw: Request['query']['page']): number => {
  const value = typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN
  return Number.isFinite(value) && value >= 1 ? value : 1
}

export const communicationListReportHandler = async (
  req: Request,
  res: Response<CommunicationListReportResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const page = parseListReportPage(req.query.page)
    const result = await new CommunicationListReportQuery().run({ player_id, page })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({
  reports,
  total
}: CommunicationListReportQueryResponse): CommunicationListReportDataResponse => {
  const reports_response: CommunicationListReportDataResponse['reports'] = reports.map(report => ({
    id: report.id,
    type: report.type,
    recorded_at: report.recorded_at,
    was_read: report.was_read
  }))

  return {
    reports: reports_response,
    total,
    page_size: COMMUNICATION_LIST_REPORT_PAGE_SIZE
  }
}
