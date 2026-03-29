import { generateWorld } from './generate'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { CellEntity } from '#core/world/cell/entity'
import { WorldError } from '#core/world/error'
import { WorldService } from '#core/world/service'
import { CellType } from '#core/world/value/cell-type'

describe('generateWorld', () => {
  const cell = CellEntity.create({
    id: 'cell_id',
    coordinates: { x: 1, y: 1, sector: 1 },
    type: CellType.FOREST,
    resource_coefficient: { plastic: 1, mushroom: 1 }
  })

  let isInitialized: jest.Mock
  let create: jest.Mock
  let repository: Pick<Repository, 'cell'>

  beforeEach(() => {
    isInitialized = jest.fn()
    create = jest.fn().mockResolvedValue(undefined)
    repository = {
      cell: {
        isInitialized,
        create
      } as unknown as Repository['cell']
    }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(WorldService, 'generate').mockReturnValue([ cell ])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws when the world is already initialized', async () => {
    isInitialized.mockResolvedValue(true)

    await expect(generateWorld()).rejects.toThrow(WorldError.ALREADY_EXISTS)
    expect(create).not.toHaveBeenCalled()
    expect(isInitialized).toHaveBeenCalledTimes(1)
  })

  it('creates each cell when the world is not initialized', async () => {
    isInitialized.mockResolvedValue(false)

    await generateWorld()

    expect(isInitialized).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledWith(cell)
  })
})
