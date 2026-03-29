import { OutpostListQuery } from '#app/query/outpost/list'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostType } from '#core/outpost/constant/type'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'
import { testResourceStock } from '../../test-support/resource-stock'

describe('OutpostListQuery', () => {
  const player_id = 'player_id'
  let repository: Pick<Repository, 'outpost' | 'cell' | 'resource_stock'>

  beforeEach(() => {
    repository = {
      outpost: { list: jest.fn().mockResolvedValue([]) } as unknown as Repository['outpost'],
      cell: { getById: jest.fn() } as unknown as Repository['cell'],
      resource_stock: {
        getByCellId: jest.fn()
      } as unknown as Repository['resource_stock']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns empty outposts and cells', async () => {
    const result = await new OutpostListQuery().run({ player_id })

    expect(result.outposts).toEqual([])
    expect(result.cells).toEqual([])
    expect(result.resource_stocks).toEqual([])
    expect(repository.outpost.list).toHaveBeenCalledWith({ player_id })
  })

  it('loads a cell per outpost', async () => {
    const cell = CellEntity.create({
      id: 'c1',
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
    const outpost = OutpostEntity.create({
      id: 'o1',
      player_id,
      cell_id: cell.id,
      type: OutpostType.TEMPORARY
    })
    const stock = testResourceStock({
      cell_id: cell.id,
      plastic: 1,
      mushroom: 2
    })
    ;(repository.outpost.list as jest.Mock).mockResolvedValue([ outpost ])
    ;(repository.cell.getById as jest.Mock).mockResolvedValue(cell)
    ;(repository.resource_stock.getByCellId as jest.Mock).mockResolvedValue(stock)

    const result = await new OutpostListQuery().run({ player_id })

    expect(result.outposts).toEqual([ outpost ])
    expect(result.cells).toEqual([ cell ])
    expect(result.resource_stocks).toEqual([ stock ])
    expect(repository.cell.getById).toHaveBeenCalledWith(cell.id)
  })
})
