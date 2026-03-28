import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CommunicationListReportDataResponse,
  CommunicationListReportResponse
} from '#client/src/endpoints/communication/report/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  CommunicationListReportQuery,
  CommunicationListReportQueryResponse
} from '#app/query/communication/report/list'

export const communicationListReportHandler = async (
  req: Request,
  res: Response<CommunicationListReportResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new CommunicationListReportQuery().run({ player_id })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ reports }: CommunicationListReportQueryResponse): CommunicationListReportDataResponse => {
  const reports_response: CommunicationListReportDataResponse['reports'] = reports.map(report => ({
    id: report.id,
    type: report.type,
    recorded_at: report.recorded_at,
    was_read: report.was_read
  }))

  return { reports: reports_response }
}
