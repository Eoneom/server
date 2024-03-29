import { TechnologyCancelCommand } from '#app/command/technology/cancel'
import { TechnologyEntity } from '#core/technology/entity'
import { now } from '#shared/time'
import assert from 'assert'
import { TechnologyError } from '#core/technology/error'
import { TechnologyCode } from '#core/technology/constant/code'

describe('TechnologyCancelCommand', () => {
  const player_id = 'player_id'
  let command: TechnologyCancelCommand
  let technology: TechnologyEntity

  beforeEach(() => {
    command = new TechnologyCancelCommand()
    technology = TechnologyEntity.create({
      ...TechnologyEntity.init({
        player_id,
        code: TechnologyCode.ARCHITECTURE
      }),
      research_at: now() + 1000 * 60
    })
  })

  it('should assert that there is a building in progress', () => {
    assert.throws(() => command.exec({ technology: null }), new RegExp(TechnologyError.NOT_IN_PROGRESS))
  })

  it('should cancel technology', () => {
    const { technology: updated_technology } = command.exec({ technology })

    assert.ok(technology.research_at)
    assert.ok(!updated_technology.research_at)
  })
})
