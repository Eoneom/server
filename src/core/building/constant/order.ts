import { BuildingCode } from '#core/building/constant/code'

export const building_order: Record<BuildingCode, number> = {
  [BuildingCode.MUSHROOM_FARM]: 1,
  [BuildingCode.MUSHROOM_WAREHOUSE]: 2,
  [BuildingCode.RECYCLING_PLANT]: 3,
  [BuildingCode.PLASTIC_WAREHOUSE]: 4,
  [BuildingCode.RESEARCH_LAB]: 5,
  [BuildingCode.CLONING_FACTORY]: 6
}
