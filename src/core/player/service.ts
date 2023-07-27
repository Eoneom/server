import { PlayerEntity } from '#core/player/entity'
import { PlayerErrors } from '#core/player/errors'


export class PlayerService {
  static init({
    name,
    does_player_exist
  }: {
    name: string,
     does_player_exist: boolean
    }): PlayerEntity {
    if (does_player_exist) {
      throw new Error(PlayerErrors.ALREADY_EXISTS)
    }

    return PlayerEntity.initPlayer({ name })
  }
}
