import { ReportType } from '../../../../src/core/communication/value/report-type'
import { TroupCode } from '../../../../src/core/troup/constant'
import { GenericResponse } from '../../response'
import { Coordinates } from '../shared/coordinates'

export interface CommunicationListReportDataResponse {
  reports: {
    id: string
    type: ReportType
    recorded_at: number
    destination: Coordinates
    origin: Coordinates
    player_id: string
    troups: {
      code: TroupCode
      count: number
    }[]
  }[]
}

export type CommunicationListReportResponse = GenericResponse<CommunicationListReportDataResponse>
