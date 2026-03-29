import { TroopListQueryResponse } from '#query/troop/list'
import { TroopListDataResponse } from '@eoneom/api-client/src/endpoints/troop/list/shared'

export const troopListResponseMapper = ({
  troops,
  costs
}: TroopListQueryResponse): TroopListDataResponse => {
  const response_troops: TroopListDataResponse['troops'] = troops.map(troop => {
    const cost = costs[troop.code]
    return {
      id: troop.id,
      code: troop.code,
      count: troop.count,
      ongoing_recruitment: troop.ongoing_recruitment ? {
        finish_at: troop.ongoing_recruitment.finish_at,
        remaining_count: troop.ongoing_recruitment.remaining_count,
        duration_per_unit: cost.duration,
        started_at: troop.ongoing_recruitment.started_at
      } : undefined,
    }
  })

  return { troops: response_troops }
}
