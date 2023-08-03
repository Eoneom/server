export interface Cost {
  base: number
  multiplier: number
}

export interface TotalCost {
  plastic: Cost
  mushroom: Cost
  duration: Cost
}
