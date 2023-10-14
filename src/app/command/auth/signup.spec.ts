import {
  AuthSignupCommand, AuthSignupExec
} from '#app/command/auth/signup'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
import { PlayerError } from '#core/player/error'
import { TechnologyCode } from '#core/technology/constant'
import { TroupCode } from '#core/troup/constant'
import { CellEntity } from '#core/world/cell.entity'
import { CellType } from '#core/world/value/cell-type'
import { FAKE_ID } from '#shared/identification'
import assert from 'assert'

describe('AuthSignupCommand', () => {
  const player_name = 'player_name'
  const city_name = 'city_name'
  const default_cell_params = {
    type: CellType.FOREST,
    resource_coefficient: {
      plastic: 1,
      mushroom: 1
    }
  }
  const city_first_cell = CellEntity.create({
    ...default_cell_params,
    id: FAKE_ID,
    coordinates: {
      x: 1,
      y: 1,
      sector: 1
    },
  })

  let command: AuthSignupCommand
  let success_params: AuthSignupExec

  beforeEach(() => {
    command = new AuthSignupCommand()
    success_params = {
      does_city_exist: false,
      does_player_exist: false,
      player_name,
      city_name,
      city_first_cell,
      cells_around_city: [
        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_1',
          coordinates: {
            sector: 1,
            x: 0,
            y: 1
          }
        }),

        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_2',
          coordinates: {
            sector: 1,
            x: 1,
            y: 0
          }
        }),
        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_3',
          coordinates: {
            sector: 1,
            x: 2,
            y: 1
          }
        }),
        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_4',
          coordinates: {
            sector: 1,
            x: 1,
            y: 2
          }
        }),
      ]
    }
  })

  it('should prevent user from signup with an existing name', () => {
    assert.throws(() => command.exec({
      ...success_params,
      does_player_exist: true,
    }), new RegExp(PlayerError.ALREADY_EXISTS))
  })

  it('should prevent user from settling a city with an existing name', () => {
    assert.throws(() => command.exec({
      ...success_params,
      does_city_exist: true,
    }), new RegExp(CityError.ALREADY_EXISTS))
  })

  it('should init all city buildings', () => {
    const {
      buildings,
      city
    } = command.exec(success_params)

    assert.strictEqual(buildings.length, Object.keys(BuildingCode).length)
    buildings.forEach(building => {
      assert.strictEqual(building.city_id, city.id)
    })
  })

  it('should init all technologies', () => {
    const {
      technologies,
      player
    } = command.exec(success_params)

    assert.strictEqual(technologies.length, Object.keys(TechnologyCode).length)
    technologies.forEach(technology => {
      assert.strictEqual(technology.player_id, player.id)
    })
  })

  it('should init all city troups', () => {
    const {
      city,
      troups
    } = command.exec(success_params)

    assert.strictEqual(troups.length, Object.keys(TroupCode).length)
    troups.forEach(troup => {
      assert.strictEqual(troup.count, 0)
      assert.strictEqual(troup.ongoing_recruitment, null)
      assert.strictEqual(troup.city_id, city.id)
    })
  })

  it('should place the city in the world', () => {
    const {
      cell,
      city,
    } = command.exec(success_params)

    assert.strictEqual(cell.city_id, city.id)
  })

  it('should init the exploration cells in the world next to the initial city', () => {
    const {
      exploration,
      player
    } = command.exec(success_params)

    assert.strictEqual(exploration.cell_ids.length, 5)
    assert.strictEqual(exploration.player_id, player.id)
  })
})
