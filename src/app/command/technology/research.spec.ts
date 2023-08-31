import {
  TechnologyResearchCommand, TechnologyResearchExec
} from '#app/command/technology/research'
import { BuildingCode } from '#core/building/constant'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyError } from '#core/technology/error'
import assert from 'assert'

describe('TechnologyResearchCommand', () => {
  const player_id = 'player_id'
  let command: TechnologyResearchCommand
  let city: CityEntity
  let technology: TechnologyEntity
  let success_params: TechnologyResearchExec

  beforeEach(() => {
    command = new TechnologyResearchCommand()
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 100000,
      mushroom: 100000
    })
    technology = TechnologyEntity.initArchitecture({ player_id })
    success_params = {
      levels: {
        building: { [BuildingCode.RESEARCH_LAB]: 1 },
        technology: {}
      },
      technology,
      city,
      is_technology_in_progress: false,
      player_id,
      research_lab_level: 0
    }
  })

  it('should prevent a player to research technology in another player city', () => {
    assert.throws(() => command.exec({
      ...success_params,
      player_id: 'another_player_id',
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should prevent a player to research if city does not have enough resources', () => {
    const city_without_ressources = CityEntity.create({
      ...city,
      plastic: 0,
      mushroom: 0
    })

    assert.throws(() => command.exec({
      ...success_params,
      city: city_without_ressources
    }), new RegExp(CityError.NOT_ENOUGH_RESOURCES))
  })

  it('should prevent a player to research if another technology is in progress', () => {
    assert.throws(() => command.exec({
      ...success_params,
      is_technology_in_progress: true
    }), new RegExp(TechnologyError.ALREADY_IN_PROGRESS))
  })

  it('should prevent player to research if building requirements are not met', () => {
    assert.throws(() => command.exec({
      ...success_params,
      levels: {
        ...success_params.levels,
        building: {}
      }
    }), new RegExp(RequirementError.BUILDING_NOT_FULFILLED))
  })

  it('should purchase the research', () => {
    const { city: updated_city } = command.exec(success_params)

    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch the technology research', () => {
    const { technology: updated_technology } = command.exec(success_params)

    assert.ok(!technology.research_at)
    assert.ok(updated_technology.research_at)
  })
})
