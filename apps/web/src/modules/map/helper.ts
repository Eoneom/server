import { CellType } from '@eoneom/api-client'

/** Edge length of one cell in Konva group space (before zoom). */
export const CELL_WORLD_SIZE = 100

export const getCellFillStyle = ({ type }: { type?: CellType }): string => {
  switch (type) {
  case CellType.FOREST:
    return '#2d6a4f'
  case CellType.RUINS:
    return '#8d6e63'
  case CellType.LAKE:
    return '#457b9d'
  }

  return '#3d3d4a'
}

export const getCellStrokeStyle = ({ type }: { type?: CellType }): string => {
  switch (type) {
  case CellType.FOREST:
    return '#1b4332'
  case CellType.RUINS:
    return '#5d4037'
  case CellType.LAKE:
    return '#1d3557'
  }

  return '#2a2a32'
}

export type TerrainLegendKey = CellType | 'unexplored'

export const terrainLegend: { key: TerrainLegendKey; label: string; color: string }[] = [
  { key: CellType.FOREST, label: 'Forêt', color: getCellFillStyle({ type: CellType.FOREST }) },
  { key: CellType.RUINS, label: 'Ruines', color: getCellFillStyle({ type: CellType.RUINS }) },
  { key: CellType.LAKE, label: 'Lac', color: getCellFillStyle({ type: CellType.LAKE }) },
  { key: 'unexplored', label: 'Inexploré', color: getCellFillStyle({}) },
]
