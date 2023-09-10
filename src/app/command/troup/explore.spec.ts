import {
  TroupExploreCommand,
  TroupExploreCommandExec
} from '#app/command/troup/explore'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { CellEntity } from '#core/world/cell.entity'
import { CellType } from '#core/world/value/cell-type'
import { FAKE_ID } from '#shared/identification'
import assert from 'assert'

describe('TroupExploreCommand', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  let success_params: TroupExploreCommandExec
  let command: TroupExploreCommand

  beforeEach(() => {
    command = new TroupExploreCommand()

    success_params = {
      player_id,
      city: CityEntity.initCity({
        name: 'Awesome city',
        player_id
      }),
      city_cell: CellEntity.create({
        id: 'city_cell_id',
        type: CellType.FOREST,
        resource_coefficient: {
          plastic: 1,
          mushroom: 1
        },
        coordinates: {
          x: 0,
          y: 0,
          sector: 1
        }
      }),
      cell_to_explore: CellEntity.create({
        id: FAKE_ID,
        type: CellType.FOREST,
        resource_coefficient: {
          plastic: 1,
          mushroom: 1
        },
        coordinates: {
          x: 1,
          y: 1,
          sector: 1
        }
      }),
      city_explorer_troup: TroupEntity.create({
        ...TroupEntity.initExplorer({
          player_id,
          city_id
        }),
        count: 1
      })
    }
  })

  it('should prevent another player from using city explorer to explore', () => {
    assert.throws(() => command.exec({
      ...success_params,
      city: CityEntity.initCity({
        name: 'another_name',
        player_id: 'another_player_id'
      })
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should prevent player from exploring if there is not explorer present in city', () => {
    assert.throws(() => command.exec({
      ...success_params,
      city_explorer_troup: TroupEntity.create({
        ...success_params.city_explorer_troup,
        count: 0
      })
    }), new RegExp(TroupError.NOT_ENOUGH_TROUPS))
  })

  it('should send the explorer in exploration to the cell', () => {
    const {
      city_troup,
      movement_troup,
      movement
    } = command.exec(success_params)

    assert.strictEqual(city_troup.count, 0)
    assert.strictEqual(movement_troup.count, 1)
    assert.ok(movement_troup.movement_id, movement.id)
    assert.strictEqual(movement.origin, success_params.city_cell.coordinates)
    assert.strictEqual(movement.destination, success_params.cell_to_explore.coordinates)
    assert.ok(movement.arrive_at)
  })
})
