import { TroupEntity } from '#core/troup/entity'

export class TroupService {
  static init({
    player_id,
    city_id
  }: {
    player_id: string
    city_id: string
  }): TroupEntity[] {
    const scout = TroupEntity.initScout({
      city_id,
      player_id
    })

    return [ scout ]
  }
}
