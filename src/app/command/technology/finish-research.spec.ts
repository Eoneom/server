import { TechnologyFinishResearchCommand } from '#app/command/technology/finish-research'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'
import { now } from '#shared/time'
import assert from 'assert'

describe('TechnologyFinishResearchCommand', () => {
  const player_id = 'player_id'
  let command: TechnologyFinishResearchCommand
  let technology_to_finish: TechnologyEntity

  beforeEach(() => {
    command = new TechnologyFinishResearchCommand()
    technology_to_finish = TechnologyEntity.create({
      ...TechnologyEntity.init({
        player_id,
        code: TechnologyCode.ARCHITECTURE 
      }),
      research_at: now()
    })
  })

  it('should not return any update if there is no technology in progress', () => {
    const { technology: updated_technology } = command.exec({ technology_to_finish: null })
    assert.ok(!updated_technology)
  })

  it('should finish the  technology upgrade', () => {
    const { technology: updated_technology } = command.exec({ technology_to_finish })

    assert.ok(technology_to_finish.research_at)
    assert.ok(updated_technology)
    assert.ok(!updated_technology.research_at)
  })
})
