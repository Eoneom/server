import assert from 'assert'
import { finishTroupExploreMovement } from '#app/command/troup/movement/finish/explore'
import { AppService } from '#app/service'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { now } from '#shared/time'
import { TroupEntity } from '#core/troup/entity'
import { ExplorationEntity } from '#core/world/exploration.entity'

describe('finishTroupExploreMovement', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const troup_id = 'troup_id'
  const exploration_id = 'exploration_id'
  const already_explored_cell_id = 'already_explored_cell_id'
  const cell_id = 'cell_id'
  const city_cell_id = 'city_cell_id'
  let movement: MovementEntity
  let troup: TroupEntity
  let exploration: ExplorationEntity
  let movementDelete: jest.Mock
  let movementCreate: jest.Mock
  let troupUpdateOne: jest.Mock
  let explorationUpdateOne: jest.Mock
  let reportCreate: jest.Mock
  let repository: Pick<Repository, 'troup' | 'movement' | 'exploration' | 'report'>

  beforeEach(() => {
    movement = MovementEntity.create({
      id: movement_id,
      player_id,
      action: MovementAction.EXPLORE,
      origin: {
        sector: 1,
        x: 2,
        y: 3,
      },
      destination: {
        sector: 4,
        x: 5,
        y: 6,
      },
      arrive_at: now() - 5000,
    })

    troup = TroupEntity.create({
      id: troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: city_cell_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: null,
    })

    exploration = ExplorationEntity.create({
      id: exploration_id,
      player_id,
      cell_ids: [ already_explored_cell_id ],
    })

    movementDelete = jest.fn().mockResolvedValue(undefined)
    movementCreate = jest.fn().mockResolvedValue(undefined)
    troupUpdateOne = jest.fn().mockResolvedValue(undefined)
    explorationUpdateOne = jest.fn().mockResolvedValue(undefined)
    reportCreate = jest.fn().mockResolvedValue(undefined)

    repository = {
      troup: {
        listByMovement: jest.fn().mockResolvedValue([ troup ]),
        updateOne: troupUpdateOne,
      } as unknown as Repository['troup'],
      movement: {
        getById: jest.fn().mockResolvedValue(movement),
        delete: movementDelete,
        create: movementCreate,
      } as unknown as Repository['movement'],
      exploration: {
        get: jest.fn().mockResolvedValue(exploration),
        updateOne: explorationUpdateOne,
      } as unknown as Repository['exploration'],
      report: {
        create: reportCreate,
      } as unknown as Repository['report'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'getExploredCellIds').mockResolvedValue([ cell_id ])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent a player for finishing a movement of another player', async () => {
    repository.movement.getById = jest.fn().mockResolvedValue(MovementEntity.create({
      ...movement,
      player_id: 'another_player_id',
    }))

    await assert.rejects(
      () => finishTroupExploreMovement({
        player_id,
        movement_id,
      }),
      new RegExp(TroupError.MOVEMENT_NOT_OWNER)
    )
  })

  it('should prevent a player from finishing a movement when arrive at date is in the future', async () => {
    repository.movement.getById = jest.fn().mockResolvedValue(MovementEntity.create({
      ...movement,
      arrive_at: now() + 10000,
    }))

    await assert.rejects(
      () => finishTroupExploreMovement({
        player_id,
        movement_id,
      }),
      new RegExp(TroupError.MOVEMENT_NOT_ARRIVED)
    )
  })

  it('should mark the cell as explored', async () => {
    await finishTroupExploreMovement({
      player_id,
      movement_id,
    })

    const updated_exploration = explorationUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_exploration.cell_ids.length, 2)
    assert.ok(updated_exploration.cell_ids.some((c: string) => c))
  })

  it('should send the troup back to base at the origin', async () => {
    await finishTroupExploreMovement({
      player_id,
      movement_id,
    })

    const movement_to_create = movementCreate.mock.calls[0][0]
    assert.strictEqual(movementDelete.mock.calls[0][0], movement.id)
    assert.strictEqual(movement_to_create.action, MovementAction.BASE)
    const troups_updated = troupUpdateOne.mock.calls.map(([ t ]) => t)
    assert.strictEqual(troups_updated.length, 1)
    assert.strictEqual(troups_updated[0].movement_id, movement_to_create.id)
  })

  it('should create a report describing the explored cell', async () => {
    await finishTroupExploreMovement({
      player_id,
      movement_id,
    })

    const report = reportCreate.mock.calls[0][0]
    assert.strictEqual(report.troups.length, 1)
    assert.strictEqual(report.was_read, false)
    assert.strictEqual(report.troups[0].code, TroupCode.EXPLORER)
  })
})
