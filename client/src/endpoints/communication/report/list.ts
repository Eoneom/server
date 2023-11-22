import { ReportType } from '../../../../../src/core/communication/value/report-type'
import { GenericResponse } from '../../../response'

export interface CommunicationListReportDataResponse {
  reports: {
    id: string
    type: ReportType
    recorded_at: number
    was_read: boolean
  }[]
}

export type CommunicationListReportResponse = GenericResponse<CommunicationListReportDataResponse>
