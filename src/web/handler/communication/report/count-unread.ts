import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CommunicationCountUnreadReportDataResponse,
  CommunicationCountUnreadReportResponse
} from '#client/src/endpoints/communication/report/count-unread'
import { getPlayerIdFromContext } from '#web/helpers'
import { CommunicationCountUnreadReportQuery } from '#app/query/communication/report/count-unread'

export const communicationCountUnreadReportHandler = async (
  req: Request,
  res: Response<CommunicationCountUnreadReportResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const { count } = await new CommunicationCountUnreadReportQuery().run({ player_id })
    const response: CommunicationCountUnreadReportDataResponse = { count }

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}
