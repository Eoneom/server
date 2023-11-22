import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CommunicationGetReportDataResponse,
  CommunicationGetReportResponse
} from '#client/src/endpoints/communication/report/get'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  CommunicationGetReportQuery,
  CommunicationGetReportQueryResponse
} from '#app/query/communication/report/get'

export const communicationGetReportHandler = async (
  req: Request,
  res: Response<CommunicationGetReportResponse>,
  next: NextFunction
) => {
  const report_id = req.params.report_id
  if (!report_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'report_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new CommunicationGetReportQuery().run({
      player_id,
      report_id
    })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ report }: CommunicationGetReportQueryResponse): CommunicationGetReportDataResponse => {
  const report_response: CommunicationGetReportDataResponse = {
    id: report.id,
    type: report.type,
    destination: report.destination,
    origin: report.origin,
    recorded_at: report.recorded_at,
    troups: report.troups.map(troup => ({
      code:troup.code,
      count: troup.count
    }))
  }

  return report_response
}
