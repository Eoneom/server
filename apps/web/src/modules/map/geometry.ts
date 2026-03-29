import { CELL_WORLD_SIZE } from '#map/helper'
import { Sector } from '#types'

export const MAP_FIT_PADDING = 0.98

export function gridDimensionFromSector(sector: Sector): number {
  const n = Math.sqrt(sector.cells.length)
  return Math.round(n)
}

export function cellTopLeft(
  gameX: number,
  gameY: number,
  gridDim: number,
  cell: number,
): { x: number; y: number } {
  return {
    x: (gameX - 1) * cell,
    y: (gridDim - gameY) * cell,
  }
}

export function cellCenter(
  gameX: number,
  gameY: number,
  gridDim: number,
  cell: number,
): { x: number; y: number } {
  const top = cellTopLeft(gameX, gameY, gridDim, cell)
  return {
    x: top.x + cell / 2,
    y: top.y + cell / 2,
  }
}

export function mapViewScaleAndPosition(
  stageWidth: number,
  stageHeight: number,
  gridDim: number,
): { scale: number; position: { x: number; y: number } } {
  const mapExtent = gridDim * CELL_WORLD_SIZE
  const w = stageWidth
  const h = stageHeight
  if (w < 32 || h < 32 || mapExtent <= 0) {
    return { scale: 1, position: { x: 0, y: 0 } }
  }
  const s = (Math.min(w, h) * MAP_FIT_PADDING) / mapExtent
  return {
    scale: s,
    position: {
      x: (w - mapExtent * s) / 2,
      y: (h - mapExtent * s) / 2,
    },
  }
}
