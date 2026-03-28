import { ReportType } from '@server-core/communication/value/report-type'
import { TroupCode } from '@server-core/troup/constant/code'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

export interface CommunicationGetReportRequest {
  report_id: string
}

export interface CommunicationGetReportDataResponse {
  id: string
  type: ReportType
  recorded_at: number
  destination: Coordinates
  origin: Coordinates
  was_read: boolean
  troups: {
    code: TroupCode
    count: number
  }[]
}

export type CommunicationGetReportResponse = GenericResponse<CommunicationGetReportDataResponse>
