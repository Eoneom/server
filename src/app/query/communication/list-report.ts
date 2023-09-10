import { GenericQuery } from '#query/generic'
import { BuildingEntity } from '#core/building/entity'
import { PricingService } from '#core/pricing/service'
import { LevelCostValue } from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'
import { BuildingCode } from '#core/building/constant'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { ReportEntity } from '#core/communication/report.entity'

export interface CommunicationListReportQueryRequest {
  player_id: string
}

export interface CommunicationListReportQueryResponse {
  reports: ReportEntity[]
}

export class CommunicationListReportQuery extends GenericQuery<CommunicationListReportQueryRequest, CommunicationListReportQueryResponse> {
  async get({ player_id }: CommunicationListReportQueryRequest): Promise<CommunicationListReportQueryResponse> {
    const reports = await this.repository.report.list({ player_id })
    return { reports }
  }
}
