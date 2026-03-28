import { CityService } from '#core/city/service'

describe('CityService', () => {
  describe('computeWarehouseFullInSeconds', () => {
    it('returns 0 when no space remains', () => {
      expect(
        CityService.computeWarehouseFullInSeconds({
          space_remaining: 0,
          earnings_per_second: 5,
        })
      ).toBe(0)
    })

    it('returns 0 when space remains but earnings are zero', () => {
      expect(
        CityService.computeWarehouseFullInSeconds({
          space_remaining: 100,
          earnings_per_second: 0,
        })
      ).toBe(0)
    })

    it('returns 0 when space remains but earnings are negative', () => {
      expect(
        CityService.computeWarehouseFullInSeconds({
          space_remaining: 100,
          earnings_per_second: -1,
        })
      ).toBe(0)
    })

    it('returns seconds until full when space and earnings are positive', () => {
      expect(
        CityService.computeWarehouseFullInSeconds({
          space_remaining: 100,
          earnings_per_second: 2,
        })
      ).toBe(50)
    })

    it('clamps negative space_remaining to 0', () => {
      expect(
        CityService.computeWarehouseFullInSeconds({
          space_remaining: -10,
          earnings_per_second: 2,
        })
      ).toBe(0)
    })
  })
})
