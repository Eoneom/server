import {
  CommunicationReportMarkCommand, CommunicationReportMarkExec
} from '#app/command/communication/report/mark'
import { CommunicationError } from '#core/communication/error'
import { ReportEntity } from '#core/communication/report.entity'
import { ReportType } from '#core/communication/value/report-type'
import { FAKE_ID } from '#shared/identification'
import { now } from '#shared/time'
import assert from 'assert'

describe('CommuncationReportMarkCommand', () => {
  const player_id = 'player_id'
  const origin = {
    x: 1,
    y: 2,
    sector: 3
  }
  const destination = {
    x: 4,
    y: 5,
    sector: 6
  }
  const resource_coefficient = {
    plastic: 1,
    mushroom: 2
  }
  let report: ReportEntity
  let success_params: CommunicationReportMarkExec

  beforeEach(() => {
    report = ReportEntity.create({
      id: FAKE_ID,
      destination,
      origin,
      player_id,
      resource_coefficient,
      troups: [],
      type: ReportType.BASE,
      recorded_at: now(),
      was_read: false,
    })

    success_params = {
      report,
      was_read: true,
      player_id
    }
  })

  it('should prevent another player from changing the report read status', () => {
    assert.throws(() => new CommunicationReportMarkCommand().exec({
      ...success_params,
      player_id: 'another_player_id'
    }), new RegExp(CommunicationError.REPORT_NOT_OWNER))
  })

  it('should change the report read status', () => {
    const { report: updated_report } = new CommunicationReportMarkCommand().exec(success_params)

    assert.strictEqual(report.was_read, false)
    assert.strictEqual(updated_report.was_read, true)
  })
})
