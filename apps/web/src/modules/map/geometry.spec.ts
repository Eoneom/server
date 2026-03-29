import {
  MAP_FIT_PADDING,
  cellCenter,
  cellTopLeft,
  gridDimensionFromSector,
  mapViewScaleAndPosition,
} from '#map/geometry'
import { CELL_WORLD_SIZE } from '#map/helper'
import { Sector } from '#types'

function sectorWithCells(length: number, id = 1): Sector {
  return {
    id,
    cells: Array.from({ length }, () => ({
      coordinates: { x: 1, y: 1 },
    })),
  }
}

describe('map geometry', () => {
  describe('gridDimensionFromSector', () => {
    it('returns sqrt of cell count rounded', () => {
      expect(gridDimensionFromSector(sectorWithCells(100))).toBe(10)
      expect(gridDimensionFromSector(sectorWithCells(1))).toBe(1)
    })
  })

  describe('cellTopLeft', () => {
    it('places bottom-left game cell at origin x and high y', () => {
      const gridDim = 10
      const cell = CELL_WORLD_SIZE
      expect(cellTopLeft(1, 1, gridDim, cell)).toEqual({ x: 0, y: 900 })
      expect(cellTopLeft(1, 10, gridDim, cell)).toEqual({ x: 0, y: 0 })
      expect(cellTopLeft(10, 10, gridDim, cell)).toEqual({ x: 900, y: 0 })
    })
  })

  describe('cellCenter', () => {
    it('is cell corner plus half a cell', () => {
      const gridDim = 10
      const cell = CELL_WORLD_SIZE
      const top = cellTopLeft(2, 3, gridDim, cell)
      const half = cell / 2
      expect(cellCenter(2, 3, gridDim, cell)).toEqual({
        x: top.x + half,
        y: top.y + half,
      })
    })
  })

  describe('mapViewScaleAndPosition', () => {
    it('returns unit scale and origin when stage is too small', () => {
      expect(mapViewScaleAndPosition(31, 400, 10)).toEqual({
        scale: 1,
        position: { x: 0, y: 0 },
      })
      expect(mapViewScaleAndPosition(400, 31, 10)).toEqual({
        scale: 1,
        position: { x: 0, y: 0 },
      })
    })

    it('returns unit scale when map extent is zero', () => {
      expect(mapViewScaleAndPosition(400, 400, 0)).toEqual({
        scale: 1,
        position: { x: 0, y: 0 },
      })
    })

    it('scales to fit shorter dimension with padding and centers', () => {
      const gridDim = 10
      const mapExtent = gridDim * CELL_WORLD_SIZE
      const w = 400
      const h = 400
      const { scale, position } = mapViewScaleAndPosition(w, h, gridDim)
      const expectedScale = (Math.min(w, h) * MAP_FIT_PADDING) / mapExtent
      expect(scale).toBeCloseTo(expectedScale, 10)
      expect(position.x).toBeCloseTo((w - mapExtent * scale) / 2, 10)
      expect(position.y).toBeCloseTo((h - mapExtent * scale) / 2, 10)
    })

    it('uses min(width,height) when stage is not square', () => {
      const gridDim = 10
      const mapExtent = gridDim * CELL_WORLD_SIZE
      const w = 800
      const h = 400
      const { scale } = mapViewScaleAndPosition(w, h, gridDim)
      expect(scale).toBeCloseTo((h * MAP_FIT_PADDING) / mapExtent, 10)
    })
  })
})
