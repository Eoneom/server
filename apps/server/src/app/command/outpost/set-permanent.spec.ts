import assert from 'assert'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { outpostSetPermanent } from '#app/command/outpost/set-permanent'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostError } from '#core/outpost/error'

describe('outpostSetPermanent', () => {
  const outpost_id = 'outpost_id'
  const player_id = 'player_id'
  const cell_id = 'cell_id'

  let updateOne: jest.Mock
  let getById: jest.Mock
  let repository: Pick<Repository, 'outpost'>

  beforeEach(() => {
    updateOne = jest.fn().mockResolvedValue(undefined)
    getById = jest.fn().mockResolvedValue(OutpostEntity.create({
      id: outpost_id,
      player_id,
      cell_id,
      type: OutpostType.TEMPORARY
    }))

    repository = {
      outpost: {
        getById,
        updateOne
      } as unknown as Repository['outpost']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should reject when player does not own outpost', async () => {
    getById.mockResolvedValue(OutpostEntity.create({
      id: outpost_id,
      player_id: 'another_player',
      cell_id,
      type: OutpostType.TEMPORARY
    }))

    await assert.rejects(
      () => outpostSetPermanent({ outpost_id, player_id }),
      new RegExp(OutpostError.NOT_OWNER)
    )
  })

  it('should update outpost type to permanent', async () => {
    await outpostSetPermanent({ outpost_id, player_id })

    assert.strictEqual(updateOne.mock.calls.length, 1)
    assert.strictEqual(updateOne.mock.calls[0][0].type, OutpostType.PERMANENT)
  })

  it('should no-op when outpost is already permanent', async () => {
    getById.mockResolvedValue(OutpostEntity.create({
      id: outpost_id,
      player_id,
      cell_id,
      type: OutpostType.PERMANENT
    }))

    await outpostSetPermanent({ outpost_id, player_id })

    assert.strictEqual(updateOne.mock.calls.length, 0)
  })
})
