import {
  NextFunction,
  Request,
  Response
} from 'express'
import { CommunicationListReportResponse } from '#client/src/endpoints/communication/list-report'
import { getPlayerIdFromContext } from '#web/helpers'
import { CommunicationListReportQuery } from '#app/query/communication/list-report'

export const communicationListReportHandler = async (
  req: Request,
  res: Response<CommunicationListReportResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const { reports } = await new CommunicationListReportQuery().get({ player_id })

    return res.json({
      status: 'ok',
      data: { reports }
    })
  } catch (err) {
    next(err)
  }
}
