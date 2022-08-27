import { BuildingEntity } from '../building/entity'

export interface Cell {
  x: number
  y: number
}

export interface ResourcesToBuild {
  wood?: number
}

export interface CityEntity {
  readonly id: string
  readonly name: string
  readonly wood: number
  readonly buildings: Record<string, BuildingEntity>
  readonly last_wood_gather: number
  readonly cells: Array<Cell>
}
