import { rebaseTroupMovement } from '#app/command/troup/movement/rebase'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { ReportType } from '#core/communication/value/report-type'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { id } from '#shared/identification'
import { now } from '#shared/time'
import assert from 'assert'

describe('rebaseTroupMovement', () => {
  const player_id = 'player_id'

  let initial_base_movement: MovementEntity
  let initial_movement_troups: TroupEntity[]
  let movementDelete: jest.Mock
  let movementCreate: jest.Mock
  let troupUpdateOne: jest.Mock
  let reportCreate: jest.Mock
  let repository: Pick<Repository, 'troup' | 'movement' | 'report'>

  beforeEach(() => {
    initial_base_movement = MovementEntity.create({
      id: id(),
      action: MovementAction.BASE,
      player_id,
      arrive_at: now() + 10 * 1000,
      origin: {
        x: 1,
        y: 2,
        sector: 3,
      },
      destination: {
        x: 4,
        y: 5,
        sector: 6,
      },
    })
    initial_movement_troups = [
      TroupEntity.create({
        id: id(),
        code: TroupCode.EXPLORER,
        count: 1,
        player_id,
        cell_id: null,
        movement_id: initial_base_movement.id,
        ongoing_recruitment: null,
      }),
    ]

    movementDelete = jest.fn().mockResolvedValue(undefined)
    movementCreate = jest.fn().mockResolvedValue(undefined)
    troupUpdateOne = jest.fn().mockResolvedValue(undefined)
    reportCreate = jest.fn().mockResolvedValue(undefined)

    repository = {
      troup: {
        listByMovement: jest.fn().mockResolvedValue(initial_movement_troups),
        updateOne: troupUpdateOne,
      } as unknown as Repository['troup'],
      movement: {
        getById: jest.fn().mockResolvedValue(initial_base_movement),
        delete: movementDelete,
        create: movementCreate,
      } as unknown as Repository['movement'],
      report: {
        create: reportCreate,
      } as unknown as Repository['report'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player from rebasing another player troups', async () => {
    repository.movement.getById = jest.fn().mockResolvedValue(MovementEntity.create({
      ...initial_base_movement,
      player_id: 'another_player_id',
    }))

    await assert.rejects(
      () => rebaseTroupMovement({
        player_id,
        movement_id: initial_base_movement.id,
      }),
      new RegExp(TroupError.NOT_OWNER)
    )
  })

  it('should remove old movement', async () => {
    await rebaseTroupMovement({
      player_id,
      movement_id: initial_base_movement.id,
    })

    assert.strictEqual(movementDelete.mock.calls[0][0], initial_base_movement.id)
  })

  it('should create a new movement with same troups and reversed trip', async () => {
    await rebaseTroupMovement({
      player_id,
      movement_id: initial_base_movement.id,
    })

    const movement_to_create = movementCreate.mock.calls[0][0]
    assert.deepStrictEqual(movement_to_create.origin, initial_base_movement.destination)
    assert.deepStrictEqual(movement_to_create.destination, initial_base_movement.origin)
    assert.ok(movement_to_create.arrive_at > initial_base_movement.arrive_at)

    const troups_to_update = troupUpdateOne.mock.calls.map(([ t ]) => t)
    troups_to_update.forEach(troup_to_update => {
      const initial_troup = initial_movement_troups.find(troup => troup.code === troup_to_update.code)

      assert.ok(initial_troup)
      assert.strictEqual(troup_to_update.id, initial_troup.id)
      assert.strictEqual(troup_to_update.count, initial_troup.count)
    })
  })

  it('should create a report indicating that a rebase was needed', async () => {
    await rebaseTroupMovement({
      player_id,
      movement_id: initial_base_movement.id,
    })

    const report = reportCreate.mock.calls[0][0]
    assert.strictEqual(report.type, ReportType.REBASE)
    assert.strictEqual(report.player_id, player_id)
    assert.strictEqual(report.was_read, false)

    assert.strictEqual(report.recorded_at, initial_base_movement.arrive_at)
    assert.deepStrictEqual(report.origin, initial_base_movement.origin)
    assert.deepStrictEqual(report.destination, initial_base_movement.destination)

    initial_movement_troups.forEach(movement_troup => {
      const report_troup = report.troups.find((t: { code: TroupCode }) => t.code === movement_troup.code)
      assert.ok(report_troup)
      assert.strictEqual(report_troup.code, movement_troup.code)
      assert.strictEqual(report_troup.count, movement_troup.count)
    })
  })
})
