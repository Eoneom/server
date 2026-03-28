import { cancelTechnology } from './cancel'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyError } from '#core/technology/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('cancelTechnology', () => {
  const player_id = 'player_id'
  let technology: TechnologyEntity
  let technologyUpdateOne: jest.Mock
  let repository: Pick<Repository, 'technology'>

  beforeEach(() => {
    technology = TechnologyEntity.create({
      ...TechnologyEntity.init({
        player_id,
        code: TechnologyCode.ARCHITECTURE
      }),
      research_at: now() + 1000 * 60
    })

    technologyUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      technology: {
        getInProgress: jest.fn().mockResolvedValue(technology),
        updateOne: technologyUpdateOne
      } as unknown as Repository['technology']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should assert that there is a technology in progress', async () => {
    repository.technology.getInProgress = jest.fn().mockResolvedValue(null)

    await assert.rejects(
      () => cancelTechnology({ player_id }),
      new RegExp(TechnologyError.NOT_IN_PROGRESS)
    )

    assert.strictEqual(technologyUpdateOne.mock.calls.length, 0)
  })

  it('should cancel technology', async () => {
    await cancelTechnology({ player_id })

    assert.ok(technology.research_at)
    assert.strictEqual(technologyUpdateOne.mock.calls.length, 1)
    const updated_technology = technologyUpdateOne.mock.calls[0][0]
    assert.ok(!updated_technology.research_at)
  })
})
