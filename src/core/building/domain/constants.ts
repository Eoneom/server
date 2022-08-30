export enum BuildingCode {
  RECYCLING_PLANT = 'recycling_plant'
}

export const recycling_plant_earnings_by_level_by_seconds: Record<number, number> = {
  1: 2,
  2: 10,
  3: 15,
  4: 30
}

export const recycling_plant_upgrade_time_in_seconds: Record<number, number> = {
  2: 5,
  3: 10,
  4: 15,
}

export const recycling_plant_plastic_costs_by_level: Record<number, number> = {
  2: 200,
  3: 500,
  4: 1000
}
