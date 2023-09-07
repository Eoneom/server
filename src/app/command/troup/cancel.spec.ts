import { TroupCancelCommand } from '#app/command/troup/cancel'
import { TroupCode } from '#core/troup/constant'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { now } from '#shared/time'
import assert from 'assert'
import { troup_costs } from '#core/pricing/constant/troup'

describe('TroupCancelCommand', () => {
  const player_id = 'player_id'
  const another_player_id = 'another_player_id'
  const code = TroupCode.SCOUT
  let city: CityEntity
  let command: TroupCancelCommand
  let troup: TroupEntity

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id
    })

    command = new TroupCancelCommand()
    const current_time = now()
    const last_progress = current_time - troup_costs[code].duration * 1000
    const remaining_count = 1000
    troup = TroupEntity.create({
      id: 'troup_id',
      code,
      count: 0,
      city_id: city.id,
      player_id,
      ongoing_recruitment: {
        finish_at: last_progress + 1000 * remaining_count * troup_costs[code].duration,
        remaining_count,
        last_progress
      }
    })
  })

  it('should prevent player from cancelling other player buildings', () => {
    assert.throws(() => command.exec({
      player_id: another_player_id,
      city,
      troup
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should assert that there is a troup in progress', () => {
    assert.throws(() => command.exec({
      player_id,
      city,
      troup: null
    }), new RegExp(TroupError.NOT_IN_PROGRESS))
  })

  it('should refund the remaining troup price when troup is cancelled', () => {
    const { city: updated_city } = command.exec({
      city,
      player_id,
      troup
    })

    assert.strictEqual(updated_city.plastic, city.plastic + 999 * troup_costs[code].plastic)
    assert.strictEqual(updated_city.mushroom, city.mushroom + 999 * troup_costs[code].mushroom)
  })

  it('should recruit troups since the last progress', () => {
    const { troup: updated_troup } = command.exec({
      city,
      player_id,
      troup
    })

    assert.strictEqual(updated_troup.count, 1)
  })

  it('should cancel troup', () => {
    const { troup: updated_troup } = command.exec({
      city,
      player_id,
      troup
    })

    assert.ok(troup.ongoing_recruitment)
    assert.ok(!updated_troup.ongoing_recruitment)
  })
})
