export interface Building {
  readonly code: string
  readonly level: number
  readonly upgrade_time?: number
}

export interface Cell {
  x: number
  y: number
}

export interface ResourcesToBuild {
  wood?: number
}

export interface City {
  readonly name: string
  readonly wood: number
  readonly buildings: Record<string, Building>
  readonly last_wood_gather: number
  readonly cells: Array<Cell>
}
