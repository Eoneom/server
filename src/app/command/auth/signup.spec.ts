import { AuthSignupCommand } from '#app/command/auth/signup'
import { BuildingCode } from '#core/building/constant'
import { CityError } from '#core/city/error'
import { PlayerError } from '#core/player/error'
import { TechnologyCode } from '#core/technology/constant'
import { CellEntity } from '#core/world/entity'
import { CellType } from '#core/world/value/cell-type'
import { FAKE_ID } from '#shared/identification'
import assert from 'assert'

describe('AuthSignupCommand', () => {
  const player_name = 'player_name'
  const city_name = 'city_name'
  const city_first_cell = CellEntity.create({
    id: FAKE_ID,
    type: CellType.FOREST,
    coordinates: {
      x: 1,
      y: 1,
      sector: 1
    },
    resource_coefficient: {
      plastic: 1,
      mushroom: 1
    }
  })

  let command: AuthSignupCommand

  beforeEach(() => {
    command = new AuthSignupCommand()
  })

  it('should prevent user from signup with an existing name', () => {
    assert.throws(() => command.exec({
      does_city_exist: false,
      does_player_exist: true,
      player_name,
      city_name,
      city_first_cell
    }), new RegExp(PlayerError.ALREADY_EXISTS))
  })

  it('should prevent user from settling a city with an existing name', () => {
    assert.throws(() => command.exec({
      does_city_exist: true,
      does_player_exist: false,
      player_name,
      city_name,
      city_first_cell
    }), new RegExp(CityError.ALREADY_EXISTS))
  })

  it('should init all city buildings', () => {
    const {
      buildings,
      city
    } = command.exec({
      does_city_exist: false,
      does_player_exist: false,
      player_name,
      city_name,
      city_first_cell
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
      city_name,
      city_first_cell
    })

    assert.strictEqual(technologies.length, Object.keys(TechnologyCode).length)
    technologies.forEach(technology => {
      assert.strictEqual(technology.player_id, player.id)
    })
  })

  it('should place the city in the world', () => {
    const {
      cell,
      city,
    } = command.exec({
      does_city_exist: false,
      does_player_exist: false,
      player_name,
      city_name,
      city_first_cell
    })

    assert.strictEqual(cell.city_id, city.id)
  })
})
