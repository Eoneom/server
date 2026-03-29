import { OutpostGetQuery } from '#app/query/outpost/get'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostError } from '#core/outpost/error'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'
import { testResourceStock } from '../../test-support/resource-stock'

describe('OutpostGetQuery', () => {
  const player_id = 'player_id'
  const outpost_id = 'o1'
  let outpost: OutpostEntity
  let cell: CellEntity
  let stock: ReturnType<typeof testResourceStock>
  let repository: Pick<Repository, 'outpost' | 'cell' | 'resource_stock'>

  beforeEach(() => {
    outpost = OutpostEntity.create({
      id: outpost_id,
      player_id,
      cell_id: 'cell1',
      type: OutpostType.TEMPORARY
    })
    stock = testResourceStock({
      cell_id: 'cell1',
      plastic: 10,
      mushroom: 20
    })
    cell = CellEntity.create({
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
      }
    })
    repository = {
      outpost: { getById: jest.fn().mockResolvedValue(outpost) } as unknown as Repository['outpost'],
      cell: { getById: jest.fn().mockResolvedValue(cell) } as unknown as Repository['cell'],
      resource_stock: {
        getByCellId: jest.fn().mockResolvedValue(stock)
      } as unknown as Repository['resource_stock']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws when outpost is not owned by player', async () => {
    const other = OutpostEntity.create({
      ...outpost,
      player_id: 'other'
    })
    ;(repository.outpost.getById as jest.Mock).mockResolvedValue(other)

    await expect(new OutpostGetQuery().run({
      player_id,
      outpost_id 
    })).rejects.toThrow(OutpostError.NOT_OWNER)
  })

  it('returns outpost and cell', async () => {
    const result = await new OutpostGetQuery().run({
      player_id,
      outpost_id 
    })

    expect(result.outpost).toBe(outpost)
    expect(result.cell).toBe(cell)
    expect(result.resource_stock).toBe(stock)
    expect(repository.cell.getById).toHaveBeenCalledWith(outpost.cell_id)
  })
})
