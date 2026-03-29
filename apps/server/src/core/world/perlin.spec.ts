import { PerlinService } from '#core/world/perlin'

describe('PerlinService', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('with deterministic random (gradient (1, 0))', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)
    })

    it('returns 0 at cell center (0.5, 0.5)', () => {
      const perlin = new PerlinService()
      expect(perlin.get(0.5, 0.5)).toBe(0)
    })

    it('returns 0 at integer lattice (0, 0)', () => {
      const perlin = new PerlinService()
      expect(perlin.get(0, 0)).toBe(0)
    })

    it('returns the same value for repeated calls at the same coordinates', () => {
      const perlin = new PerlinService()
      const a = perlin.get(0.37, 2.81)
      const b = perlin.get(0.37, 2.81)
      expect(b).toBe(a)
    })
  })

  describe('output magnitude', () => {
    it('keeps |get(x, y)| within sqrt(2) for random inputs', () => {
      const bound = Math.sqrt(2) + 1e-9
      for (let i = 0; i < 50; i++) {
        const perlin = new PerlinService()
        const x = Math.random() * 20 - 5
        const y = Math.random() * 20 - 5
        expect(Math.abs(perlin.get(x, y))).toBeLessThanOrEqual(bound)
      }
    })
  })
})
