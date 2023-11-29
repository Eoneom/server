import { TroupListQueryResponse } from '#app/query/troup/list'
import { TroupListDataResponse } from '#client/src/endpoints/troup/list/shared'

export const troupListResponseMapper = ({
  troups,
  costs,
  requirement
}: TroupListQueryResponse): TroupListDataResponse => {
  const response_troups: TroupListDataResponse['troups'] = troups.map(troup => {
    const cost = costs[troup.id]
    return {
      id: troup.id,
      code: troup.code,
      count: troup.count,
      ongoing_recruitment: troup.ongoing_recruitment ? {
        finish_at: troup.ongoing_recruitment.finish_at,
        remaining_count: troup.ongoing_recruitment.remaining_count
      } : undefined,
      cost: {
        plastic: cost.resource.plastic,
        mushroom: cost.resource.mushroom,
        duration: cost.duration
      },
      requirement: requirement[troup.code]
    }
  })

  return { troups: response_troups }
}
