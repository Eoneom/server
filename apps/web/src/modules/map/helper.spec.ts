import { CellType } from '@eoneom/api-client'
import { getCellFillStyle, terrainLegend } from '#map/helper'

describe('map helper', () => {
  it('maps terrain types to fill colors', () => {
    expect(getCellFillStyle({ type: CellType.FOREST })).toMatch(/^#/)
    expect(getCellFillStyle({ type: CellType.RUINS })).toMatch(/^#/)
    expect(getCellFillStyle({ type: CellType.LAKE })).toMatch(/^#/)
    expect(getCellFillStyle({})).toMatch(/^#/)
  })

  it('terrainLegend lists plain and typed terrains', () => {
    expect(terrainLegend.some(e => e.key === 'unexplored')).toBe(true)
    expect(terrainLegend.some(e => e.key === CellType.FOREST)).toBe(true)
  })
})
