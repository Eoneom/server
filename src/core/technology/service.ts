import { TechnologyEntity } from '#core/technology/entity'

export class TechnologyService {
  static init({ player_id }: { player_id: string }): TechnologyEntity[] {
    const architecture = TechnologyEntity.initArchitecture({ player_id })

    return [ architecture ]
  }
}
