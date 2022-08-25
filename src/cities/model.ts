interface Building {
  readonly level: number
}

export interface City {
  readonly name: string
  readonly wood: number
  readonly buildings: Record<string, Building>
  readonly last_gather: number
}
