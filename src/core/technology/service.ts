import { technology_order } from '#core/technology/constant/order'
import { TechnologyEntity } from '#core/technology/entity'

export class TechnologyService {
  static init({ player_id }: { player_id: string }): TechnologyEntity[] {
    const architecture = TechnologyEntity.initArchitecture({ player_id })

    return [ architecture ]
  }

  static sortTechnologies({ technologies }: {technologies: TechnologyEntity[]}): TechnologyEntity[] {
    return technologies.sort((a, b ) => technology_order[a.code] - technology_order[b.code])
  }
}
