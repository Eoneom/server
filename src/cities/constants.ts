export const STARTING_WOOD = 200
export const WOOD_CAMP = 'wood_camp'
export const SIZE_PER_CELL = 10

export const wood_camp_gains_by_level_by_seconds: Record<number, number> = {
  1: 2,
  2: 10,
  3: 15,
  4: 30
}

export const wood_camp_upgrade_time_in_seconds: Record<number, number> = {
  2: 5,
  3: 10,
  4: 15,
}

export const wood_camp_costs_by_level: Record<number, number> = {
  2: 200,
  3: 500,
  4: 1000
}
