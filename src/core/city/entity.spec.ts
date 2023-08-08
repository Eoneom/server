import {
  STARTING_MUSHROOM,
  STARTING_PLASTIC
} from '#core/city/constants'
import { CityEntity } from '#core/city/entity'
import { CityErrors } from '#core/city/errors'
import assert from 'assert'

describe('CityEntity', () => {
  const name = 'City name'
  const player_id = 'fake-player-id'
  let city: CityEntity

  beforeEach(() => {
    city = CityEntity.initCity({
      name,
      player_id
    })
  })

  describe('purchase', () => {
    it('should prevent purchase when city does not have required resources', () => {
      assert.throws(() => city.purchase({
        plastic: 2000,
        mushroom: 2000
      }), new RegExp(CityErrors.NOT_ENOUGH_RESOURCES))
    })

    it('should remove cost from city resources when city have enough', () => {
      const plastic_cost = 10
      const mushroom_cost = 20

      const updated_city = city.purchase({
        plastic: plastic_cost,
        mushroom: mushroom_cost
      })

      assert.strictEqual(updated_city.plastic, STARTING_PLASTIC - plastic_cost)
      assert.strictEqual(updated_city.mushroom, STARTING_MUSHROOM - mushroom_cost)
    })
  })

  describe('refund', () => {
    it('should refund the resources amount', () => {
      const plastic_refund = 10
      const mushroom_refund = 20
      const updated_city = city.refund({
        plastic: plastic_refund,
        mushroom: mushroom_refund
      })

      assert.strictEqual(updated_city.plastic, STARTING_PLASTIC + plastic_refund)
      assert.strictEqual(updated_city.mushroom, STARTING_MUSHROOM + mushroom_refund)
    })
  })

  describe('gather', () => {
    it('should no gather resources when there no earnings at all', () => {
      const {
        updated,
        city: updated_city
      } = city.gather({
        earnings_by_second: {
          plastic: 0,
          mushroom: 0
        },
        gather_at_time: city.last_plastic_gather + 1000
      })

      assert.strictEqual(updated, false)
      assert.strictEqual(updated_city.plastic, city.plastic)
      assert.strictEqual(updated_city.last_plastic_gather, city.last_plastic_gather)
      assert.strictEqual(updated_city.mushroom, city.mushroom)
      assert.strictEqual(updated_city.last_mushroom_gather, city.last_mushroom_gather)
    })

    it('should not gather resources when we try to gather at a time before last gather', () => {
      const {
        updated,
        city: updated_city
      } = city.gather({
        earnings_by_second: {
          plastic: 1000,
          mushroom: 1000
        },
        gather_at_time: city.last_plastic_gather - 2000
      })

      assert.strictEqual(updated, false)
      assert.strictEqual(updated_city.plastic, city.plastic)
      assert.strictEqual(updated_city.last_plastic_gather, city.last_plastic_gather)
      assert.strictEqual(updated_city.mushroom, city.mushroom)
      assert.strictEqual(updated_city.last_mushroom_gather, city.last_mushroom_gather)
    })

    it('should not gather resources when not enough time passed', () => {
      const {
        updated,
        city: updated_city
      } = city.gather({
        earnings_by_second: {
          plastic: 1000,
          mushroom: 1000
        },
        gather_at_time: city.last_plastic_gather + 1
      })

      assert.strictEqual(updated, false)
      assert.strictEqual(updated_city.plastic, city.plastic)
      assert.strictEqual(updated_city.last_plastic_gather, city.last_plastic_gather)
      assert.strictEqual(updated_city.mushroom, city.mushroom)
      assert.strictEqual(updated_city.last_mushroom_gather, city.last_mushroom_gather)
    })

    it('should gather resources when enough time passed', () => {
      const plastic_earnings = 1000
      const mushroom_earnings = 2000
      const seconds_elapsed = 2
      const {
        updated,
        city: updated_city
      } = city.gather({
        earnings_by_second: {
          plastic: plastic_earnings,
          mushroom: mushroom_earnings
        },
        gather_at_time: city.last_plastic_gather + seconds_elapsed * 1000
      })

      assert.strictEqual(updated, true)
      assert.strictEqual(updated_city.plastic, city.plastic + seconds_elapsed * plastic_earnings)
      assert.ok(updated_city.last_plastic_gather !== city.last_plastic_gather)
      assert.strictEqual(updated_city.mushroom, city.mushroom + seconds_elapsed * mushroom_earnings)
      assert.ok(updated_city.last_mushroom_gather !== city.last_mushroom_gather)
    })
  })

  describe('isOwnedBy', () => {
    it('should return that player owns the city if he is the one who settled it', () => {
      const is_owned_by = city.isOwnedBy(player_id)

      assert.ok(is_owned_by)
    })

    it('should return that player does not own the city if he is not the one who settle it', () => {
      const is_owned_by = city.isOwnedBy('another-random-id')

      assert.ok(!is_owned_by)
    })
  })
})
