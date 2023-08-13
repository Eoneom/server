import { AuthSignupCommand } from '#app/command/auth/signup'
import { BuildingCode } from '#core/building/constants'
import { CityErrors } from '#core/city/errors'
import { PlayerErrors } from '#core/player/errors'
import { TechnologyCode } from '#core/technology/constants'
import assert from 'assert'

describe('AuthSignupCommand', () => {
  const player_name = 'player_name'
  const city_name = 'city_name'
  let command: AuthSignupCommand

  beforeEach(() => {
    command = new AuthSignupCommand()
  })

  it('should prevent user from signup with an existing name', () => {
    assert.throws(() => command.exec({
      does_city_exist: false,
      does_player_exist: true,
      player_name,
      city_name
    }), new RegExp(PlayerErrors.ALREADY_EXISTS))
  })

  it('should prevent user from settling a city with an existing name', () => {
    assert.throws(() => command.exec({
      does_city_exist: true,
      does_player_exist: false,
      player_name,
      city_name
    }), new RegExp(CityErrors.ALREADY_EXISTS))
  })

  it('should init all city buildings', () => {
    const {
      buildings,
      city
    } = command.exec({
      does_city_exist: false,
      does_player_exist: false,
      player_name,
      city_name
    })

    assert.strictEqual(buildings.length, Object.keys(BuildingCode).length)
    buildings.forEach(building => {
      assert.strictEqual(building.city_id, city.id)
    })
  })

  it('should init all technologies', () => {
    const {
      technologies,
      player
    } = command.exec({
      does_city_exist: false,
      does_player_exist: false,
      player_name,
      city_name
    })

    assert.strictEqual(technologies.length, Object.keys(TechnologyCode).length)
    technologies.forEach(technology => {
      assert.strictEqual(technology.player_id, player.id)
    })
  })
})
