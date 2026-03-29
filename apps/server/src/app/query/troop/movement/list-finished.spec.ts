import { TroopMovementListFinishedQuery } from '#app/query/troop/movement/list-finished'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'

describe('TroopMovementListFinishedQuery', () => {
  const player_id = 'player_id'
  const ids = [
    'a',
    'b' 
  ]
  let repository: Pick<Repository, 'movement'>

  beforeEach(() => {
    repository = { movement: { listFinishedIds: jest.fn().mockResolvedValue(ids) } as unknown as Repository['movement'] }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns finished movement ids', async () => {
    const result = await new TroopMovementListFinishedQuery().run({ player_id })

    expect(result.movement_ids).toEqual(ids)
    expect(repository.movement.listFinishedIds).toHaveBeenCalledWith({ player_id })
  })
})
