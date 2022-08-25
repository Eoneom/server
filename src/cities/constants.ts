export const STARTING_WOOD = 200
export const WOOD_CAMP = 'wood_camp'
export const SIZE_PER_CELL = 2

export const wood_camp_gains_by_level_by_seconds: Record<number, number> = {
  1: 10,
  2: 20,
  3: 45,
  4: 70
}

export const wood_camp_upgrade_time_in_seconds: Record<number, number> = {
  2: 5,
  3: 30,
  4: 60,
}
