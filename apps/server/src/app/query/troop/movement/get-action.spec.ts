import { TroopMovementGetActionQuery } from '#app/query/troop/movement/get-action'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { MovementAction } from '#core/troop/constant/movement-action'
import { MovementEntity } from '#core/troop/movement/entity'

describe('TroopMovementGetActionQuery', () => {
  const movement_id = 'mov1'
  let movement: MovementEntity
  let repository: Pick<Repository, 'movement'>

  beforeEach(() => {
    movement = MovementEntity.create({
      id: movement_id,
      player_id: 'p1',
      action: MovementAction.BASE,
      origin: {
        x: 0,
        y: 0,
        sector: 1 
      },
      destination: {
        x: 2,
        y: 0,
        sector: 1 
      },
      arrive_at: 50_000
    })
    repository = { movement: { getById: jest.fn().mockResolvedValue(movement) } as unknown as Repository['movement'] }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns movement action', async () => {
    const result = await new TroopMovementGetActionQuery().run({ movement_id })

    expect(result.action).toBe(MovementAction.BASE)
    expect(repository.movement.getById).toHaveBeenCalledWith(movement_id)
  })
})
