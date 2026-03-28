import { CellType } from '@kroust/swarm-client'

export const getCellFillStyle = ({ type }: { type?: CellType }): string => {
  switch(type) {
  case CellType.FOREST:
    return '#0F0'
  case CellType.RUINS:
    return '#F00'
  case CellType.LAKE:
    return '#00F'
  }

  return '#000'
}
