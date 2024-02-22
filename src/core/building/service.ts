import { BuildingCode } from '#core/building/constant/code'
import { building_order } from '#core/building/constant/order'
import { BuildingEntity } from '#core/building/entity'
import { FAKE_ID } from '#shared/identification'

export class BuildingService {
  static init({ city_id }: { city_id: string }): BuildingEntity[] {
    return Object.values(BuildingCode).map(code => {
      return BuildingEntity.create({
        id: FAKE_ID,
        code,
        city_id,
        level: 0
      })
    })
  }

  static sortBuildings({ buildings }: { buildings: BuildingEntity[] }): BuildingEntity[] {
    return buildings.sort((a, b) => building_order[a.code] - building_order[b.code])
  }
}
