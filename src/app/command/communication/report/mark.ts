import { GenericCommand } from '#app/command/generic'
import { CommunicationError } from '#core/communication/error'
import { ReportEntity } from '#core/communication/report.entity'

interface CommunicationReportMarkRequest {
  report_id: string
  player_id: string
  was_read: boolean
}

export interface CommunicationReportMarkExec {
  report: ReportEntity
  player_id: string
  was_read: boolean
}

interface CommunicationReportMarkSave {
  report: ReportEntity
}

export class CommunicationReportMarkCommand extends GenericCommand<
  CommunicationReportMarkRequest,
  CommunicationReportMarkExec,
  CommunicationReportMarkSave
> {
  constructor() {
    super({ name: 'communication:report:mark' })
  }

  async fetch({
    report_id,
    player_id,
    was_read
  }: CommunicationReportMarkRequest): Promise<CommunicationReportMarkExec> {
    const report = await this.repository.report.getById(report_id)
    return {
      report,
      player_id,
      was_read
    }
  }

  exec({
    report,
    player_id,
    was_read
  }: CommunicationReportMarkExec): CommunicationReportMarkSave {
    if (!report.isOwnedBy(player_id)) {
      throw new Error(CommunicationError.REPORT_NOT_OWNER)
    }

    const updated_report = report.markAs(was_read)

    return { report: updated_report }
  }

  async save({ report }: CommunicationReportMarkSave): Promise<void> {
    await this.repository.report.updateOne(report)
  }
}
