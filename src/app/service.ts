import { Factory } from '#app/factory'
import { BuildingCode } from '#core/building/constants'
import { BuildingService } from '#core/building/service'

export class AppService {
  static async getCityEarningsBySecond({ city_id }: { city_id: string }): Promise<{ plastic: number, mushroom: number }> {
    const repository = Factory.getRepository()
    const [
      mushroom_farm,
      recycling_plant
    ] = await Promise.all([
      repository.building.findOneOrThrow({
        city_id,
        code: BuildingCode.MUSHROOM_FARM
      }),
      repository.building.findOneOrThrow({
        city_id,
        code: BuildingCode.RECYCLING_PLANT
      })
    ])

    return BuildingService.getEarningsBySecond({
      recycling_plant_level: recycling_plant.level,
      mushroom_farm_level: mushroom_farm.level
    })
  }
}
