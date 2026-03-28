import assert from 'assert'
import { finishTroupBaseMovement } from '#app/command/troup/movement/finish/base'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { now } from '#shared/time'
import { TroupEntity } from '#core/troup/entity'
import { Coordinates } from '#core/world/value/coordinates'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostError } from '#core/outpost/error'

describe('finishTroupBaseMovement', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const movement_troup_id = 'movement_troup_id'
  const city_troup_id = 'city_troup_id'
  const origin: Coordinates = {
    sector: 1,
    x: 2,
    y: 3,
  }
  const destination_cell_id = 'destination_cell_id'
  const destination: Coordinates = {
    sector: 4,
    x: 5,
    y: 6,
  }
  let movement: MovementEntity
  let movement_troup_explorer: TroupEntity
  let movement_troup_settler: TroupEntity
  let destination_troup_explorer: TroupEntity

  let movementDelete: jest.Mock
  let troupUpdateOne: jest.Mock
  let troupDelete: jest.Mock
  let reportCreate: jest.Mock
  let outpostCreate: jest.Mock
  let repository: Pick<
    Repository,
    'troup' | 'movement' | 'cell' | 'outpost' | 'report'
  >

  function mountRepository({
    city_exists,
    outpost_exists,
    existing_outposts_count,
  }: {
    city_exists: boolean
    outpost_exists: boolean
    existing_outposts_count: number
  }) {
    movementDelete = jest.fn().mockResolvedValue(undefined)
    troupUpdateOne = jest.fn().mockResolvedValue(undefined)
    troupDelete = jest.fn().mockResolvedValue(undefined)
    reportCreate = jest.fn().mockResolvedValue(undefined)
    outpostCreate = jest.fn().mockResolvedValue(undefined)

    repository = {
      troup: {
        listByMovement: jest.fn().mockResolvedValue([
          movement_troup_explorer,
          movement_troup_settler,
        ]),
        listInCell: jest.fn().mockResolvedValue([ destination_troup_explorer ]),
        updateOne: troupUpdateOne,
        delete: troupDelete,
      } as unknown as Repository['troup'],
      movement: {
        getById: jest.fn().mockResolvedValue(movement),
        delete: movementDelete,
      } as unknown as Repository['movement'],
      cell: {
        getCell: jest.fn().mockResolvedValue({
          id: destination_cell_id,
          coordinates: destination,
          city_id: city_exists ? 'some_city' : undefined,
        }),
      } as unknown as Repository['cell'],
      outpost: {
        existsOnCell: jest.fn().mockResolvedValue(outpost_exists),
        countForPlayer: jest.fn().mockResolvedValue(existing_outposts_count),
        create: outpostCreate,
      } as unknown as Repository['outpost'],
      report: {
        create: reportCreate,
      } as unknown as Repository['report'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  }

  beforeEach(() => {
    movement = MovementEntity.create({
      id: movement_id,
      player_id,
      action: MovementAction.BASE,
      origin,
      destination,
      arrive_at: now() - 5000,
    })

    movement_troup_settler = TroupEntity.create({
      id: movement_troup_id,
      code: TroupCode.SETTLER,
      player_id,
      cell_id: null,
      count: 1,
      ongoing_recruitment: null,
      movement_id: movement.id,
    })

    movement_troup_explorer = TroupEntity.create({
      id: movement_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: null,
      count: 2,
      ongoing_recruitment: null,
      movement_id: movement.id,
    })

    destination_troup_explorer = TroupEntity.create({
      id: city_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: destination_cell_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: null,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent a player for finishing a movement of another player', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 0,
    })
    repository.movement.getById = jest.fn().mockResolvedValue(MovementEntity.create({
      ...movement,
      player_id: 'another_player_id',
    }))

    await assert.rejects(
      () => finishTroupBaseMovement({
        player_id,
        movement_id,
      }),
      new RegExp(TroupError.NOT_OWNER)
    )
  })

  it('should prevent a player from finishing a movement when arrive at date is in the future', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 0,
    })
    repository.movement.getById = jest.fn().mockResolvedValue(MovementEntity.create({
      ...movement,
      arrive_at: now() + 10000,
    }))

    await assert.rejects(
      () => finishTroupBaseMovement({
        player_id,
        movement_id,
      }),
      new RegExp(TroupError.MOVEMENT_NOT_ARRIVED)
    )
  })

  it('should not create a temporary outpost if there is an existing city', async () => {
    mountRepository({
      city_exists: true,
      outpost_exists: false,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    assert.strictEqual(outpostCreate.mock.calls.length, 0)
  })

  it('should not create a temporary outpost if there is an existing outpost', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: true,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    assert.strictEqual(outpostCreate.mock.calls.length, 0)
  })

  it('should throw an error when we should create temporary outpost and limit is reached', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 1000,
    })

    await assert.rejects(
      () => finishTroupBaseMovement({
        player_id,
        movement_id,
      }),
      new RegExp(OutpostError.LIMIT_REACHED)
    )
  })

  it('should create a temporary outpost if there is no city or outpost', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    assert.strictEqual(outpostCreate.mock.calls.length, 1)
    const outpost = outpostCreate.mock.calls[0][0]
    assert.strictEqual(outpost.type, OutpostType.TEMPORARY)
    assert.strictEqual(outpost.player_id, player_id)
    assert.strictEqual(outpost.cell_id, destination_cell_id)
  })

  it('should create all troups of the temporary outpost if there is not city or outpost', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    const delete_ids = troupDelete.mock.calls.map(([ idArg ]) => idArg)
    assert.strictEqual(delete_ids.length, 2)
    assert.strictEqual(delete_ids[0], movement_troup_id)

    assert.strictEqual(troupUpdateOne.mock.calls.length, 3)

    const updated_troups = troupUpdateOne.mock.calls.map(([ t ]) => t)
    const updated_explorer = updated_troups.find(t => t.code === TroupCode.EXPLORER)
    const updated_settler = updated_troups.find(t => t.code === TroupCode.SETTLER)
    assert.ok(updated_explorer)
    assert.ok(updated_settler)

    assert.strictEqual(updated_explorer.count, movement_troup_explorer.count)
    assert.strictEqual(updated_settler.count, movement_troup_settler.count)
    updated_troups.forEach(troup => {
      assert.strictEqual(troup.cell_id, destination_cell_id)
    })

    assert.strictEqual(movementDelete.mock.calls[0][0], movement.id)
  })

  it('should move troups to the destination when there is a city', async () => {
    mountRepository({
      city_exists: true,
      outpost_exists: false,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    const delete_ids = troupDelete.mock.calls.map(([ idArg ]) => idArg)
    assert.strictEqual(delete_ids.length, 2)
    assert.strictEqual(delete_ids[0], movement_troup_id)

    const updated_troups = troupUpdateOne.mock.calls.map(([ t ]) => t)
    assert.strictEqual(updated_troups.length, 2)

    const updated_explorer = updated_troups.find(t => t.code === TroupCode.EXPLORER)
    const updated_settler = updated_troups.find(t => t.code === TroupCode.SETTLER)
    assert.ok(updated_explorer)
    assert.ok(updated_settler)

    assert.strictEqual(
      updated_explorer.count,
      destination_troup_explorer.count + movement_troup_explorer.count
    )
    assert.strictEqual(updated_settler.count, movement_troup_settler.count)
    updated_troups.forEach(troup => {
      assert.strictEqual(troup.cell_id, destination_cell_id)
    })

    assert.strictEqual(movementDelete.mock.calls[0][0], movement.id)
  })

  it('should move troups to the destination when there is an outpost', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: true,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    const delete_ids = troupDelete.mock.calls.map(([ idArg ]) => idArg)
    assert.strictEqual(delete_ids.length, 2)

    const updated_troups = troupUpdateOne.mock.calls.map(([ t ]) => t)
    assert.strictEqual(updated_troups.length, 2)

    const updated_explorer = updated_troups.find(t => t.code === TroupCode.EXPLORER)
    const updated_settler = updated_troups.find(t => t.code === TroupCode.SETTLER)
    assert.ok(updated_explorer)
    assert.ok(updated_settler)

    assert.strictEqual(
      updated_explorer.count,
      destination_troup_explorer.count + movement_troup_explorer.count
    )
    assert.strictEqual(updated_settler.count, movement_troup_settler.count)
    updated_troups.forEach(troup => {
      assert.strictEqual(troup.cell_id, destination_cell_id)
    })

    assert.strictEqual(movementDelete.mock.calls[0][0], movement.id)
  })

  it('should create a report describing the explored cell', async () => {
    mountRepository({
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 0,
    })

    await finishTroupBaseMovement({
      player_id,
      movement_id,
    })

    const report = reportCreate.mock.calls[0][0]
    assert.strictEqual(report.troups.length, 2)
    assert.strictEqual(report.was_read, false)

    const report_explorer = report.troups.find((t: { code: TroupCode }) => t.code === TroupCode.EXPLORER)
    const report_settler = report.troups.find((t: { code: TroupCode }) => t.code === TroupCode.SETTLER)
    assert.ok(report_explorer)
    assert.ok(report_settler)

    assert.strictEqual(report_explorer.count, movement_troup_explorer.count)
    assert.strictEqual(report_settler.count, movement_troup_settler.count)
  })
})
