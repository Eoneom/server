export interface Building {
  readonly code: string
  readonly level: number
  readonly upgrade_time?: number
}

export interface City {
  readonly name: string
  readonly wood: number
  readonly buildings: Record<string, Building>
  readonly last_wood_gather: number
}
