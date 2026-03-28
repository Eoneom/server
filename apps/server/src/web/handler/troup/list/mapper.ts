import { TroupListQueryResponse } from '#app/query/troup/list'
import { TroupListDataResponse } from '#client/src/endpoints/troup/list/shared'

export const troupListResponseMapper = ({
  troups,
  costs
}: TroupListQueryResponse): TroupListDataResponse => {
  const response_troups: TroupListDataResponse['troups'] = troups.map(troup => {
    const cost = costs[troup.code]
    return {
      id: troup.id,
      code: troup.code,
      count: troup.count,
      ongoing_recruitment: troup.ongoing_recruitment ? {
        finish_at: troup.ongoing_recruitment.finish_at,
        remaining_count: troup.ongoing_recruitment.remaining_count,
        duration_per_unit: cost.duration
      } : undefined,
    }
  })

  return { troups: response_troups }
}
