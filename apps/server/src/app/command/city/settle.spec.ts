import { citySettle } from './settle'
import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostError } from '#core/outpost/error'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { CellEntity } from '#core/world/cell.entity'
import { ExplorationEntity } from '#core/world/exploration.entity'
import { CellType } from '#core/world/value/cell-type'
import { FAKE_ID } from '#shared/identification'
import assert from 'assert'

describe('citySettle', () => {
  const player_id = 'player_id'
  const cell_id = 'cell_id'
  const city_name = 'city_name'
  const outpost_id = FAKE_ID

  const default_cell_params = {
    type: CellType.FOREST,
    resource_coefficient: {
      plastic: 1,
      mushroom: 1
    }
  }

  let exploration: ExplorationEntity
  let settler_troup: TroupEntity
  let outpost: OutpostEntity
  let cell: CellEntity
  let cells_around_city: CellEntity[]

  let outpostDelete: jest.Mock
  let cityCreate: jest.Mock
  let buildingCreate: jest.Mock
  let troupUpdateOne: jest.Mock
  let cellUpdateOne: jest.Mock
  let explorationUpdateOne: jest.Mock
  let repository: Pick<Repository, 'outpost' | 'city' | 'exploration' | 'cell' | 'troup' | 'building'>

  beforeEach(() => {
    outpost = OutpostEntity.create({
      id: outpost_id,
      player_id,
      cell_id,
      type: OutpostType.TEMPORARY
    })

    settler_troup = TroupEntity.create({
      id: 'troup_id',
      code: TroupCode.SETTLER,
      count: 1,
      player_id,
      cell_id,
      ongoing_recruitment: null,
      movement_id: null
    })

    cell = CellEntity.create({
      id: cell_id,
      coordinates: {
        sector: 1,
        x: 2,
        y: 3
      },
      type: CellType.FOREST,
      resource_coefficient: {
        plastic: 1,
        mushroom: 1
      }
    })

    exploration = ExplorationEntity.init({
      player_id,
      cell_ids: []
    })

    cells_around_city = [
      CellEntity.create({
        ...default_cell_params,
        id: 'cell_id_1',
        coordinates: {
          sector: 1,
          x: 1,
          y: 3
        }
      }),
      CellEntity.create({
        ...default_cell_params,
        id: 'cell_id_2',
        coordinates: {
          sector: 1,
          x: 3,
          y: 3
        }
      }),
      CellEntity.create({
        ...default_cell_params,
        id: 'cell_id_3',
        coordinates: {
          sector: 1,
          x: 2,
          y: 2
        }
      }),
      CellEntity.create({
        ...default_cell_params,
        id: 'cell_id_4',
        coordinates: {
          sector: 1,
          x: 2,
          y: 4
        }
      })
    ]

    outpostDelete = jest.fn().mockResolvedValue(undefined)
    cityCreate = jest.fn().mockResolvedValue(undefined)
    buildingCreate = jest.fn().mockResolvedValue(undefined)
    troupUpdateOne = jest.fn().mockResolvedValue(undefined)
    cellUpdateOne = jest.fn().mockResolvedValue(undefined)
    explorationUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      outpost: {
        getById: jest.fn().mockResolvedValue(outpost),
        delete: outpostDelete
      } as unknown as Repository['outpost'],
      city: {
        count: jest.fn().mockResolvedValue(0),
        exist: jest.fn().mockResolvedValue(false),
        create: cityCreate
      } as unknown as Repository['city'],
      exploration: {
        get: jest.fn().mockResolvedValue(exploration),
        updateOne: explorationUpdateOne
      } as unknown as Repository['exploration'],
      cell: {
        getById: jest.fn().mockResolvedValue(cell),
        updateOne: cellUpdateOne
      } as unknown as Repository['cell'],
      troup: {
        getInCell: jest.fn().mockResolvedValue(settler_troup),
        updateOne: troupUpdateOne
      } as unknown as Repository['troup'],
      building: {
        create: buildingCreate
      } as unknown as Repository['building']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'getCellsAround').mockResolvedValue(cells_around_city)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player from settling a city if limit is reached', async () => {
    repository.city.count = jest.fn().mockResolvedValue(10000)

    await assert.rejects(
      () => citySettle({
        outpost_id,
        player_id,
        city_name
      }),
      new RegExp(CityError.LIMIT_REACHED)
    )
  })

  it('should prevent player from settling a city on another player outpost', async () => {
    repository.outpost.getById = jest.fn().mockResolvedValue(
      OutpostEntity.create({
        ...outpost,
        player_id: 'another_player_id'
      })
    )

    await assert.rejects(
      () => citySettle({
        outpost_id,
        player_id,
        city_name
      }),
      new RegExp(OutpostError.NOT_OWNER)
    )
  })

  it('should prevent player from settling a city when there is no settler available', async () => {
    repository.troup.getInCell = jest.fn().mockResolvedValue(
      TroupEntity.create({
        ...settler_troup,
        count: 0
      })
    )

    await assert.rejects(
      () => citySettle({
        outpost_id,
        player_id,
        city_name
      }),
      new RegExp(CityError.NO_SETTLER_AVAILABLE)
    )
  })

  it('should prevent player from settling a city with an existing name', async () => {
    repository.city.exist = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => citySettle({
        outpost_id,
        player_id,
        city_name
      }),
      new RegExp(CityError.ALREADY_EXISTS)
    )
  })

  it('should create a city with given name', async () => {
    const { city_id } = await citySettle({
      outpost_id,
      player_id,
      city_name
    })

    assert.strictEqual(cityCreate.mock.calls.length, 1)
    const created_city = cityCreate.mock.calls[0][0]
    assert.strictEqual(created_city.name, city_name)
    assert.strictEqual(city_id, created_city.id)
  })

  it('should place the city in the world', async () => {
    await citySettle({
      outpost_id,
      player_id,
      city_name
    })

    assert.strictEqual(cellUpdateOne.mock.calls.length, 1)
    const updated_cell = cellUpdateOne.mock.calls[0][0]
    const created_city = cityCreate.mock.calls[0][0]
    assert.strictEqual(updated_cell.city_id, created_city.id)
  })

  it('should create buildings for this city', async () => {
    await citySettle({
      outpost_id,
      player_id,
      city_name
    })

    assert.strictEqual(buildingCreate.mock.calls.length, Object.keys(BuildingCode).length)
    const created_city = cityCreate.mock.calls[0][0]
    buildingCreate.mock.calls.forEach(([ building ]) => {
      assert.strictEqual(building.city_id, created_city.id)
    })
  })

  it('should init the exploration cells in the world next to the initial city', async () => {
    await citySettle({
      outpost_id,
      player_id,
      city_name
    })

    assert.strictEqual(explorationUpdateOne.mock.calls.length, 1)
    const updated_exploration = explorationUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_exploration.cell_ids.length, 5)
  })

  it('should provide the outpost to delete', async () => {
    await citySettle({
      outpost_id,
      player_id,
      city_name
    })

    assert.strictEqual(outpostDelete.mock.calls.length, 1)
    assert.strictEqual(outpostDelete.mock.calls[0][0], outpost.id)
  })

  it('should remove one settler from the original outpost troups', async () => {
    await citySettle({
      outpost_id,
      player_id,
      city_name
    })

    assert.strictEqual(troupUpdateOne.mock.calls.length, 1)
    const updated_troup = troupUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_troup.id, settler_troup.id)
    assert.strictEqual(updated_troup.count, 0)
  })
})
