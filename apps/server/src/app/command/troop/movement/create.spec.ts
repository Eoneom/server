import { createTroopMovement } from '#app/command/troop/movement/create'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostEntity } from '#core/outpost/entity'
import { TroopCode } from '#core/troop/constant/code'
import { MovementAction } from '#core/troop/constant/movement-action'
import { TroopEntity } from '#core/troop/entity'
import { TroopError } from '#core/troop/error'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'
import { id } from '#shared/identification'
import assert from 'assert'

describe('createTroopMovement', () => {
  const player_id = 'player_id'
  const cell_id = 'cell_id'
  const origin = { x: 1, y: 2, sector: 3 }
  const destination = { x: 4, y: 5, sector: 6 }

  let origin_troop: TroopEntity
  let cell: CellEntity
  let troopCreate: jest.Mock
  let troopUpdateOne: jest.Mock
  let troopDelete: jest.Mock
  let movementCreate: jest.Mock
  let outpostDelete: jest.Mock
  let searchByCell: jest.Mock
  let listInCell: jest.Mock
  let repository: Pick<Repository, 'cell' | 'troop' | 'outpost' | 'movement'>

  beforeEach(() => {
    origin_troop = TroopEntity.create({
      id: id(),
      code: TroopCode.EXPLORER,
      count: 10,
      player_id,
      cell_id,
      movement_id: null,
      ongoing_recruitment: null,
    })

    cell = CellEntity.create({
      id: cell_id,
      coordinates: origin,
      type: CellType.FOREST,
      resource_coefficient: { plastic: 0.1, mushroom: 0.1 },
    })

    troopCreate = jest.fn().mockResolvedValue(undefined)
    troopUpdateOne = jest.fn().mockResolvedValue(undefined)
    troopDelete = jest.fn().mockResolvedValue(undefined)
    movementCreate = jest.fn().mockResolvedValue(undefined)
    outpostDelete = jest.fn().mockResolvedValue(undefined)
    searchByCell = jest.fn().mockResolvedValue(null)
    listInCell = jest.fn().mockResolvedValue([ origin_troop ])

    repository = {
      cell: {
        getCell: jest.fn().mockResolvedValue(cell),
      } as unknown as Repository['cell'],
      troop: {
        listInCell,
        create: troopCreate,
        updateOne: troopUpdateOne,
        delete: troopDelete,
      } as unknown as Repository['troop'],
      outpost: {
        searchByCell,
        delete: outpostDelete,
      } as unknown as Repository['outpost'],
      movement: {
        create: movementCreate,
      } as unknown as Repository['movement'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  async function callCreate(move_troops: { code: TroopCode; count: number }[]) {
    return createTroopMovement({
      player_id,
      origin,
      destination,
      action: MovementAction.EXPLORE,
      move_troops,
    })
  }

  it('should reject when origin does not have enough troops', async () => {
    listInCell = jest.fn().mockResolvedValue([
      TroopEntity.create({
        ...origin_troop,
        count: 3,
      }),
    ])
    repository.troop = {
      ...repository.troop,
      listInCell,
    } as unknown as Repository['troop']

    await assert.rejects(
      () => callCreate([ { code: TroopCode.EXPLORER, count: 5 } ]),
      new RegExp(TroopError.NOT_ENOUGH_TROUPS)
    )

    assert.strictEqual(movementCreate.mock.calls.length, 0)
    assert.strictEqual(troopCreate.mock.calls.length, 0)
  })

  it('should create movement and update origin troops on partial move without outpost', async () => {
    const result = await callCreate([ { code: TroopCode.EXPLORER, count: 5 } ])

    assert.strictEqual(result.deleted_outpost_id, undefined)
    assert.strictEqual(movementCreate.mock.calls.length, 1)

    const movement = movementCreate.mock.calls[0][0]
    assert.strictEqual(movement.player_id, player_id)
    assert.strictEqual(movement.action, MovementAction.EXPLORE)
    assert.deepStrictEqual(movement.origin, origin)
    assert.deepStrictEqual(movement.destination, destination)

    assert.strictEqual(troopCreate.mock.calls.length, 1)
    const created_troop = troopCreate.mock.calls[0][0]
    assert.strictEqual(created_troop.movement_id, movement.id)
    assert.strictEqual(created_troop.code, TroopCode.EXPLORER)
    assert.strictEqual(created_troop.count, 5)

    assert.strictEqual(troopUpdateOne.mock.calls.length, 1)
    const [ updated_origin ] = troopUpdateOne.mock.calls[0]
    assert.strictEqual(updated_origin.id, origin_troop.id)
    assert.strictEqual(updated_origin.count, 5)

    assert.strictEqual(outpostDelete.mock.calls.length, 0)
    assert.strictEqual(troopDelete.mock.calls.length, 0)
  })

  it('should delete temporary outpost and origin troops when cell is fully emptied', async () => {
    const outpost_id = 'outpost_id'
    const temporary_outpost = OutpostEntity.create({
      id: outpost_id,
      player_id,
      cell_id,
      type: OutpostType.TEMPORARY,
    })
    searchByCell = jest.fn().mockResolvedValue(temporary_outpost)
    repository.outpost = {
      searchByCell,
      delete: outpostDelete,
    } as unknown as Repository['outpost']

    const result = await callCreate([ { code: TroopCode.EXPLORER, count: 10 } ])

    assert.strictEqual(result.deleted_outpost_id, outpost_id)
    assert.strictEqual(outpostDelete.mock.calls[0][0], outpost_id)
    assert.strictEqual(troopDelete.mock.calls[0][0], origin_troop.id)
    assert.strictEqual(troopUpdateOne.mock.calls.length, 0)
  })

  it('should not delete outpost when temporary outpost remains garrisoned after partial move', async () => {
    const temporary_outpost = OutpostEntity.create({
      id: 'outpost_id',
      player_id,
      cell_id,
      type: OutpostType.TEMPORARY,
    })
    searchByCell = jest.fn().mockResolvedValue(temporary_outpost)
    repository.outpost = {
      searchByCell,
      delete: outpostDelete,
    } as unknown as Repository['outpost']

    await callCreate([ { code: TroopCode.EXPLORER, count: 5 } ])

    assert.strictEqual(outpostDelete.mock.calls.length, 0)
    assert.strictEqual(troopDelete.mock.calls.length, 0)
    assert.strictEqual(troopUpdateOne.mock.calls.length, 1)
  })

  it('should not delete permanent outpost when cell is fully emptied', async () => {
    const permanent_outpost = OutpostEntity.create({
      id: 'outpost_id',
      player_id,
      cell_id,
      type: OutpostType.PERMANENT,
    })
    searchByCell = jest.fn().mockResolvedValue(permanent_outpost)
    repository.outpost = {
      searchByCell,
      delete: outpostDelete,
    } as unknown as Repository['outpost']

    const result = await callCreate([ { code: TroopCode.EXPLORER, count: 10 } ])

    assert.strictEqual(result.deleted_outpost_id, undefined)
    assert.strictEqual(outpostDelete.mock.calls.length, 0)
    assert.strictEqual(troopDelete.mock.calls.length, 0)
    assert.strictEqual(troopUpdateOne.mock.calls.length, 1)
  })
})
