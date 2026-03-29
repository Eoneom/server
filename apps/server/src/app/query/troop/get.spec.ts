import { TroopGetQuery } from '#app/query/troop/get'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'
import { TroopCode } from '#core/troop/constant/code'
import { TroopEntity } from '#core/troop/entity'
import { TroopError } from '#core/troop/error'

describe('TroopGetQuery', () => {
  const player_id = 'player_id'
  const troop_id = 'troop_id'
  let troop_no_cell: TroopEntity
  let repository: Pick<Repository, 'troop' | 'technology' | 'cell' | 'building'>

  beforeEach(() => {
    troop_no_cell = TroopEntity.create({
      id: troop_id,
      code: TroopCode.EXPLORER,
      count: 5,
      player_id,
      cell_id: null,
      movement_id: 'mov1',
      ongoing_recruitment: null
    })
    repository = {
      troop: { getById: jest.fn().mockResolvedValue(troop_no_cell) } as unknown as Repository['troop'],
      technology: { getLevel: jest.fn().mockResolvedValue(0) } as unknown as Repository['technology'],
      cell: { getById: jest.fn() } as unknown as Repository['cell'],
      building: { getLevel: jest.fn() } as unknown as Repository['building']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws when troop is not owned by player', async () => {
    const other = TroopEntity.create({
      ...troop_no_cell,
      player_id: 'other'
    })
    ;(repository.troop.getById as jest.Mock).mockResolvedValue(other)

    await expect(new TroopGetQuery().run({
      troop_id,
      player_id 
    })).rejects.toThrow(TroopError.NOT_OWNER)
  })

  it('returns troop and pricing without cell when troop has no cell_id', async () => {
    const result = await new TroopGetQuery().run({
      troop_id,
      player_id 
    })

    expect(result.troop).toBe(troop_no_cell)
    expect(result.cost).toBeDefined()
    expect(result.requirement).toBeDefined()
    expect(repository.cell.getById).not.toHaveBeenCalled()
  })

  it('uses cloning factory level when troop is on a city cell', async () => {
    const cell = CellEntity.create({
      id: 'cell1',
      coordinates: {
        x: 0,
        y: 0,
        sector: 1 
      },
      type: CellType.FOREST,
      resource_coefficient: {
        plastic: 1,
        mushroom: 1 
      },
      city_id: 'city1'
    })
    const troop_in_city = TroopEntity.create({
      id: troop_id,
      code: TroopCode.EXPLORER,
      count: 1,
      player_id,
      cell_id: cell.id,
      movement_id: null,
      ongoing_recruitment: null
    })
    ;(repository.troop.getById as jest.Mock).mockResolvedValue(troop_in_city)
    repository.cell = { getById: jest.fn().mockResolvedValue(cell) } as unknown as Repository['cell']
    repository.building = { getLevel: jest.fn().mockResolvedValue(3) } as unknown as Repository['building']

    await new TroopGetQuery().run({
      troop_id,
      player_id 
    })

    expect(repository.building.getLevel).toHaveBeenCalledWith({
      city_id: 'city1',
      code: BuildingCode.CLONING_FACTORY
    })
  })
})
