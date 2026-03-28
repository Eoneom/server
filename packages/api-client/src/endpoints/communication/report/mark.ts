import { GenericResponse } from '../../../response'

export interface CommunicationMarkReportRequest {
  report_id: string
  was_read: boolean
}

export type CommunicationMarkReportResponse = GenericResponse<void>
