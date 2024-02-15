import {
  CitySettleCommand,
  CitySettleCommandExec
} from '#app/command/city/settle'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostEntity } from '#core/outpost/entity'
import { OutpostError } from '#core/outpost/error'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { CellEntity } from '#core/world/cell.entity'
import { ExplorationEntity } from '#core/world/exploration.entity'
import { CellType } from '#core/world/value/cell-type'
import { FAKE_ID } from '#shared/identification'
import assert from 'assert'

describe('CitySettleCommand', () => {
  const player_id = 'player_id'
  const cell_id = 'cell_id'
  const city_name = 'city_name'
  const default_cell_params = {
    type: CellType.FOREST,
    resource_coefficient: {
      plastic: 1,
      mushroom: 1
    }
  }
  let exploration: ExplorationEntity
  let settler_troup: TroupEntity
  let outpost: OutpostEntity
  let success_params: CitySettleCommandExec
  let command: CitySettleCommand
  let cell: CellEntity

  beforeEach(() => {
    command = new CitySettleCommand()

    outpost = OutpostEntity.create({
      id: FAKE_ID,
      player_id,
      cell_id,
      type: OutpostType.TEMPORARY
    })

    settler_troup = TroupEntity.create({
      id: 'troup_id',
      code: TroupCode.SETTLER,
      count: 1,
      player_id,
      cell_id,
      ongoing_recruitment: null,
      movement_id:  null
    })

    cell = CellEntity.create({
      id: cell_id,
      coordinates: {
        sector: 1,
        x: 2,
        y: 3
      },
      type: CellType.FOREST,
      resource_coefficient: {
        plastic: 1,
        mushroom: 1
      }
    })

    exploration = ExplorationEntity.init({
      player_id,
      cell_ids: []
    })

    success_params = {
      existing_cities_count: 0,
      outpost,
      player_id,
      city_name,
      settler_troup,
      does_city_exist: false,
      cell,
      exploration,
      cells_around_city: [
        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_1',
          coordinates: {
            sector: 1,
            x: 1,
            y: 3
          }
        }),

        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_2',
          coordinates: {
            sector: 1,
            x: 3,
            y: 3
          }
        }),
        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_3',
          coordinates: {
            sector: 1,
            x: 2,
            y: 2
          }
        }),
        CellEntity.create({
          ...default_cell_params,
          id: 'cell_id_4',
          coordinates: {
            sector: 1,
            x: 2,
            y: 4
          }
        }),
      ]
    }
  })

  it('should prevent player from settling a city if limit is reached', () => {
    assert.throws(() => {
      command.exec({
        ...success_params,
        existing_cities_count: 10000
      }), new RegExp(CityError.LIMIT_REACHED)
    })
  })

  it('should prevent player from settling a city on another player outpost', () => {
    assert.throws(() => {
      command.exec({
        ...success_params,
        outpost: OutpostEntity.create({
          ...outpost,
          player_id: 'another_player_id'
        })
      })

    }, new RegExp(OutpostError.NOT_OWNER))
  })

  it('should prevent player from settling a city when there is no settler available', () => {
    assert.throws(() => {
      command.exec({
        ...success_params,
        settler_troup: TroupEntity.create({
          ...settler_troup,
          count: 0
        })
      })
    }, new RegExp(CityError.NO_SETTLER_AVAILABLE))
  })

  it('should prevent player from settling a city with an existing name', () => {
    assert.throws(() => command.exec({
      ...success_params,
      does_city_exist: true,
    }), new RegExp(CityError.ALREADY_EXISTS))
  })

  it('should create a city with given name', () => {
    const { city_to_create } = command.exec(success_params)
    assert.strictEqual(city_to_create.name, city_name)
  })

  it('should place the city in the world', () => {
    const {
      cell_to_update,
      city_to_create,
    } = command.exec(success_params)

    assert.strictEqual(cell_to_update.city_id, city_to_create.id)
  })

  it('should create buildings for this city', () => {
    const {
      buildings_to_create, city_to_create
    } = command.exec(success_params)

    assert.strictEqual(buildings_to_create.length, Object.keys(BuildingCode).length)
    buildings_to_create.forEach(building => {
      assert.strictEqual(building.city_id, city_to_create.id)
    })
  })

  it('should init the exploration cells in the world next to the initial city', () => {
    const { exploration_to_update } = command.exec(success_params)

    assert.strictEqual(exploration_to_update.cell_ids.length, 5)
  })

  it('should provide the outpost to delete', () => {
    const { outpost_to_delete } = command.exec(success_params)

    assert.strictEqual(outpost_to_delete.id, outpost.id)
  })

  it('should remove one settler from the original outpost troups', () => {
    const { settler_troup_to_update } = command.exec(success_params)

    assert.strictEqual(settler_troup_to_update.id, settler_troup.id)
    assert.strictEqual(settler_troup_to_update.count, 0)
  })
})
