import { GenericResponse } from '../../../response'

export interface CommunicationCountUnreadReportDataResponse {
  count: number
}

export type CommunicationCountUnreadReportResponse = GenericResponse<CommunicationCountUnreadReportDataResponse>
