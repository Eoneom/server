import { TechnologyListQuery } from '#app/query/technology/list'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'

describe('TechnologyListQuery', () => {
  const player_id = 'player_id'
  let technologies: TechnologyEntity[]
  let repository: Pick<Repository, 'technology'>

  beforeEach(() => {
    technologies = [
      TechnologyEntity.create({
        id: 't2',
        player_id,
        code: TechnologyCode.REPLICATION_CATALYST,
        level: 0
      }),
      TechnologyEntity.create({
        id: 't1',
        player_id,
        code: TechnologyCode.ARCHITECTURE,
        level: 1
      })
    ]
    repository = { technology: { list: jest.fn().mockResolvedValue(technologies) } as unknown as Repository['technology'] }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns sorted technologies', async () => {
    const result = await new TechnologyListQuery().run({ player_id })

    expect(result.technologies).toHaveLength(2)
    expect(repository.technology.list).toHaveBeenCalledWith({ player_id })
  })
})
