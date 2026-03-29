import { TroopMovementGetQuery } from '#app/query/troop/movement/get'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { MovementAction } from '#core/troop/constant/movement-action'
import { MovementEntity } from '#core/troop/movement/entity'
import { TroopEntity } from '#core/troop/entity'
import { TroopCode } from '#core/troop/constant/code'
import { TroopError } from '#core/troop/error'

describe('TroopMovementGetQuery', () => {
  const player_id = 'player_id'
  const movement_id = 'mov1'
  let movement: MovementEntity
  let troops: TroopEntity[]
  let repository: Pick<Repository, 'movement' | 'troop'>

  beforeEach(() => {
    movement = MovementEntity.create({
      id: movement_id,
      player_id,
      action: MovementAction.EXPLORE,
      origin: {
        x: 0,
        y: 0,
        sector: 1 
      },
      destination: {
        x: 1,
        y: 0,
        sector: 1 
      },
      arrive_at: 99_999
    })
    troops = [
      TroopEntity.create({
        id: 't1',
        code: TroopCode.EXPLORER,
        count: 1,
        player_id,
        cell_id: null,
        movement_id,
        ongoing_recruitment: null
      })
    ]
    repository = {
      movement: { getById: jest.fn().mockResolvedValue(movement) } as unknown as Repository['movement'],
      troop: { listByMovement: jest.fn().mockResolvedValue(troops) } as unknown as Repository['troop']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws when movement is not owned by player', async () => {
    const other = MovementEntity.create({
      ...movement,
      player_id: 'other'
    })
    ;(repository.movement.getById as jest.Mock).mockResolvedValue(other)

    await expect(new TroopMovementGetQuery().run({
      player_id,
      movement_id 
    })).rejects.toThrow(TroopError.MOVEMENT_NOT_FOUND)
  })

  it('returns movement and troops', async () => {
    const result = await new TroopMovementGetQuery().run({
      player_id,
      movement_id 
    })

    expect(result.movement).toBe(movement)
    expect(result.troops).toBe(troops)
    expect(repository.troop.listByMovement).toHaveBeenCalledWith({ movement_id })
  })
})
