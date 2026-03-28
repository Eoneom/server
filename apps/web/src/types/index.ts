import {
  BuildingGetDataResponse,
  BuildingListDataResponse,
  CityGetDataResponse,
  CityListDataResponse,
  CommunicationGetReportDataResponse,
  CommunicationListReportDataResponse,
  OutpostGetDataResponse,
  OutpostListDataResponse,
  TechnologyGetDataResponse,
  TechnologyListDataResponse,
  TroupGetDataResponse,
  TroupGetMovementDataResponse,
  TroupListDataResponse,
  TroupListMovementDataResponse,
  TroupMovementEstimateDataResponse,
  WorldGetSectorDataResponse,
} from '@kroust/swarm-client'

export type City = CityGetDataResponse
export type CityItem = CityListDataResponse['cities'][number]

export type Building = BuildingGetDataResponse
export type BuildingItem = BuildingListDataResponse['buildings'][number]

export type Technology = TechnologyGetDataResponse
export type TechnologyItem = TechnologyListDataResponse['technologies'][number]

export type Sector = WorldGetSectorDataResponse & { id: number }

export type Troup = TroupGetDataResponse
export type TroupItem = TroupListDataResponse['troups'][number]

export type Movement = TroupGetMovementDataResponse
export type MovementItem = TroupListMovementDataResponse['movements'][number]
export type MovementEstimation = TroupMovementEstimateDataResponse

export type Report = CommunicationGetReportDataResponse
export type ReportItem = CommunicationListReportDataResponse['reports'][number]

export type Outpost = OutpostGetDataResponse
export type OutpostItem = OutpostListDataResponse['outposts'][number]
