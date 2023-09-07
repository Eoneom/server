import {
  REGION_SIZE, SECTOR_SIZE
} from '#core/world/constant/size'
import {
  normalizeCoordinate, normalizeSector
} from '#core/world/helper'
import assert from 'assert'

describe('WorldHelper', () => {
  describe('normalizeCoordinate', () => {
    it('should return 1 when random number is 0', () => {
      const coordinate = normalizeCoordinate(0)

      assert.strictEqual(coordinate, 1)
    })

    it('should return sector size when random number is near 1', () => {
      const coordinate = normalizeCoordinate(0.9999)

      assert.strictEqual(coordinate, SECTOR_SIZE)
    })
  })

  describe('normalizeSector', () => {
    it('should return 1 when random number is 0', () => {
      const sector = normalizeSector(0)

      assert.strictEqual(sector, 1)
    })

    it('should return maximum sector number when random number is near 1', () => {
      const sector = normalizeSector(0.9999)

      assert.strictEqual(sector, REGION_SIZE*REGION_SIZE)
    })
  })
})
