import { TechnologyFinishResearchCommand } from '#app/command/technology/finish-research'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyError } from '#core/technology/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('TechnologyFinishResearchCommand', () => {
  const player_id = 'player_id'
  let command: TechnologyFinishResearchCommand
  let technology_to_finish: TechnologyEntity

  beforeEach(() => {
    command = new TechnologyFinishResearchCommand()
    technology_to_finish = TechnologyEntity.create({
      ...TechnologyEntity.initArchitecture({ player_id }),
      research_at: now()
    })
  })

  it('should prevent a research if there is no technology in progress', () => {
    assert.throws(() => command.exec({ technology_to_finish: null }), new RegExp(TechnologyError.NOT_IN_PROGRESS))
  })

  it('should finish the  technology upgrade', () => {
    const { technology: updated_technology } = command.exec({ technology_to_finish })

    assert.ok(technology_to_finish.research_at)
    assert.ok(!updated_technology.research_at)
  })
})
