import { TechnologyCode } from '@server-core/technology/constant/code'
import { GenericResponse } from '../../response'

export type TechnologyListEntry =
  | {
      id: string
      code: TechnologyCode
      level: number
      research_at: number
      research_started_at: number
    }
  | {
      id: string
      code: TechnologyCode
      level: number
    }

export interface TechnologyListDataResponse {
  technologies: TechnologyListEntry[]
}

export type TechnologyListResponse = GenericResponse<TechnologyListDataResponse>
