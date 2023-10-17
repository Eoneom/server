import { BuildingCode } from '#core/building/constant/code'

export const isWarehouseBuildingCode = (code: string): code is BuildingCode.MUSHROOM_WAREHOUSE | BuildingCode.PLASTIC_WAREHOUSE => code === BuildingCode.MUSHROOM_WAREHOUSE || code === BuildingCode.PLASTIC_WAREHOUSE
