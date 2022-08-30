export enum BuildingCode {
  RECYCLING_PLANT = 'recycling_plant',
  MUSHROOM_FARM = 'mushroom_farm'
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

export const mushroom_farm_earnings_by_level_by_seconds: Record<number, number> = {
  1: 25,
  2: 35,
  3: 60,
  4: 100
}

export const mushroom_farm_upgrade_time_in_seconds: Record<number, number> = {
  2: 60,
  3: 120,
  4: 180,
}

export const mushroom_farm_plastic_costs_by_level: Record<number, number> = {
  2: 100,
  3: 400,
  4: 800
}
