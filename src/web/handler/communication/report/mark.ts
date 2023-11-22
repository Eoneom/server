import {
  NextFunction,
  Request,
  Response
} from 'express'
import { CommunicationMarkReportResponse } from '#client/src/endpoints/communication/report/mark'
import { getPlayerIdFromContext } from '#web/helpers'
import { CommunicationReportMarkCommand } from '#app/command/communication/report/mark'

export const communicationMarkReportHandler = async (
  req: Request,
  res: Response<CommunicationMarkReportResponse>,
  next: NextFunction
) => {
  const report_id = req.body.report_id
  if (!report_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'report_id:not-found'
    })
  }

  const was_read = req.body.was_read
  if (was_read === undefined || was_read === null) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'was_read:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    await new CommunicationReportMarkCommand().run({
      player_id,
      report_id,
      was_read: Boolean(was_read)
    })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
