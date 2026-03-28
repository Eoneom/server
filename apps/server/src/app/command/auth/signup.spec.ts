import { signupAuth } from './signup'
import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
import { PlayerError } from '#core/player/error'
import { TechnologyCode } from '#core/technology/constant/code'
import { TroopCode } from '#core/troop/constant/code'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'
import { FAKE_ID } from '#shared/identification'
import assert from 'assert'

describe('signupAuth', () => {
  const player_name = 'player_name'
  const city_name = 'city_name'
  const default_cell_params = {
    type: CellType.FOREST,
    resource_coefficient: {
      plastic: 1,
      mushroom: 1
    }
  }
  const city_first_cell = CellEntity.create({
    ...default_cell_params,
    id: FAKE_ID,
    coordinates: {
      x: 1,
      y: 1,
      sector: 1
    }
  })

  const cells_around_city = [
    CellEntity.create({
      ...default_cell_params,
      id: 'cell_id_1',
      coordinates: {
        sector: 1,
        x: 0,
        y: 1
      }
    }),
    CellEntity.create({
      ...default_cell_params,
      id: 'cell_id_2',
      coordinates: {
        sector: 1,
        x: 1,
        y: 0
      }
    }),
    CellEntity.create({
      ...default_cell_params,
      id: 'cell_id_3',
      coordinates: {
        sector: 1,
        x: 2,
        y: 1
      }
    }),
    CellEntity.create({
      ...default_cell_params,
      id: 'cell_id_4',
      coordinates: {
        sector: 1,
        x: 1,
        y: 2
      }
    })
  ]

  let playerCreate: jest.Mock
  let cityCreate: jest.Mock
  let buildingCreate: jest.Mock
  let technologyCreate: jest.Mock
  let cellUpdateOne: jest.Mock
  let troopCreate: jest.Mock
  let explorationCreate: jest.Mock
  let repository: Pick<Repository, 'player' | 'city' | 'building' | 'technology' | 'cell' | 'troop' | 'exploration'>

  beforeEach(() => {
    playerCreate = jest.fn().mockResolvedValue(undefined)
    cityCreate = jest.fn().mockResolvedValue(undefined)
    buildingCreate = jest.fn().mockResolvedValue(undefined)
    technologyCreate = jest.fn().mockResolvedValue(undefined)
    cellUpdateOne = jest.fn().mockResolvedValue(undefined)
    troopCreate = jest.fn().mockResolvedValue(undefined)
    explorationCreate = jest.fn().mockResolvedValue(undefined)

    repository = {
      player: {
        exist: jest.fn().mockResolvedValue(false),
        create: playerCreate
      } as unknown as Repository['player'],
      city: {
        exist: jest.fn().mockResolvedValue(false),
        create: cityCreate
      } as unknown as Repository['city'],
      building: {
        create: buildingCreate
      } as unknown as Repository['building'],
      technology: {
        create: technologyCreate
      } as unknown as Repository['technology'],
      cell: {
        updateOne: cellUpdateOne
      } as unknown as Repository['cell'],
      troop: {
        create: troopCreate
      } as unknown as Repository['troop'],
      exploration: {
        create: explorationCreate
      } as unknown as Repository['exploration']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'selectCityFirstCell').mockResolvedValue(city_first_cell)
    jest.spyOn(AppService, 'getCellsAround').mockResolvedValue(cells_around_city)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent user from signup with an existing name', async () => {
    repository.player.exist = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => signupAuth({ player_name, city_name }),
      new RegExp(PlayerError.ALREADY_EXISTS)
    )

    assert.strictEqual(playerCreate.mock.calls.length, 0)
  })

  it('should prevent user from settling a city with an existing name', async () => {
    repository.city.exist = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => signupAuth({ player_name, city_name }),
      new RegExp(CityError.ALREADY_EXISTS)
    )

    assert.strictEqual(playerCreate.mock.calls.length, 0)
  })

  it('should init all city buildings', async () => {
    await signupAuth({ player_name, city_name })

    assert.strictEqual(buildingCreate.mock.calls.length, Object.keys(BuildingCode).length)
    const created_city = cityCreate.mock.calls[0][0]
    buildingCreate.mock.calls.forEach(([ building ]) => {
      assert.strictEqual(building.city_id, created_city.id)
    })
  })

  it('should init all technologies', async () => {
    await signupAuth({ player_name, city_name })

    assert.strictEqual(technologyCreate.mock.calls.length, Object.keys(TechnologyCode).length)
    const created_player = playerCreate.mock.calls[0][0]
    technologyCreate.mock.calls.forEach(([ technology ]) => {
      assert.strictEqual(technology.player_id, created_player.id)
    })
  })

  it('should init all city troops', async () => {
    await signupAuth({ player_name, city_name })

    assert.strictEqual(troopCreate.mock.calls.length, Object.keys(TroopCode).length)
    const created_player = playerCreate.mock.calls[0][0]
    troopCreate.mock.calls.forEach(([ troop ]) => {
      assert.strictEqual(troop.count, 0)
      assert.strictEqual(troop.player_id, created_player.id)
      assert.strictEqual(troop.cell_id, city_first_cell.id)
      assert.strictEqual(troop.ongoing_recruitment, null)
      assert.strictEqual(troop.movement_id, null)
    })
  })

  it('should place the city in the world', async () => {
    await signupAuth({ player_name, city_name })

    assert.strictEqual(cellUpdateOne.mock.calls.length, 1)
    const updated_cell = cellUpdateOne.mock.calls[0][0]
    const created_city = cityCreate.mock.calls[0][0]
    assert.strictEqual(updated_cell.city_id, created_city.id)
  })

  it('should init the exploration cells in the world next to the initial city', async () => {
    await signupAuth({ player_name, city_name })

    assert.strictEqual(explorationCreate.mock.calls.length, 1)
    const exploration = explorationCreate.mock.calls[0][0]
    const created_player = playerCreate.mock.calls[0][0]
    assert.strictEqual(exploration.cell_ids.length, 5)
    assert.strictEqual(exploration.player_id, created_player.id)
  })
})
