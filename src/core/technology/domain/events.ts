import { TechnologyCode } from './constants'

export enum TechnologyEventCode {
  REQUEST_RESEARCH_TRIGGERED = 'technology:request-research-triggered',
  RESEARCH_REQUESTED = 'technology:research-requested',
  RESEARCH_LAUNCHED = 'technology:research-launched',
  RESEARCHED = 'technology:research',
}

export interface TechnologyPayloads {
  [TechnologyEventCode.REQUEST_RESEARCH_TRIGGERED]: {
    city_id: string
    player_id: string
    code: TechnologyCode
  }
  [TechnologyEventCode.RESEARCH_REQUESTED]: {
    city_id: string
    code: TechnologyCode
    current_level: number
  }
  [TechnologyEventCode.RESEARCH_LAUNCHED]: {
    code: string
  },
  [TechnologyEventCode.RESEARCHED]: {
    code: string
  },
}
