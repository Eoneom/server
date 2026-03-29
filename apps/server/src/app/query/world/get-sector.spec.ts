import { WorldGetSectorQuery } from '#app/query/world/get-sector'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'

describe('WorldGetSectorQuery', () => {
  const player_id = 'player_id'
  const sector = 3
  let cells: CellEntity[]
  let repository: Pick<Repository, 'cell' | 'exploration'>

  beforeEach(() => {
    cells = [
      CellEntity.create({
        id: 'c1',
        coordinates: {
          x: 0,
          y: 0,
          sector 
        },
        type: CellType.FOREST,
        resource_coefficient: {
          plastic: 1,
          mushroom: 1 
        }
      })
    ]
    repository = {
      cell: { getSector: jest.fn().mockResolvedValue(cells) } as unknown as Repository['cell'],
      exploration: {
        get: jest.fn().mockResolvedValue({
          cell_ids: [
            'c1',
            'c2' 
          ] 
        }) 
      } as unknown as Repository['exploration']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns sector cells and explored ids', async () => {
    const result = await new WorldGetSectorQuery().run({
      sector,
      player_id 
    })

    expect(result.cells).toBe(cells)
    expect(result.explored_cell_ids).toEqual([
      'c1',
      'c2' 
    ])
    expect(repository.cell.getSector).toHaveBeenCalledWith({ sector })
    expect(repository.exploration.get).toHaveBeenCalledWith({ player_id })
  })
})
