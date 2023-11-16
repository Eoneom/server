import { TechnologyCode } from '#core/technology/constant/code'
import { technology_order } from '#core/technology/constant/order'
import { TechnologyEntity } from '#core/technology/entity'

export class TechnologyService {
  static init({ player_id }: { player_id: string }): TechnologyEntity[] {
    const technologies = Object.values(TechnologyCode).map(code => TechnologyEntity.init({
      player_id,
      code
    }))

    return technologies
  }

  static sortTechnologies({ technologies }: {technologies: TechnologyEntity[]}): TechnologyEntity[] {
    return technologies.sort((a, b ) => technology_order[a.code] - technology_order[b.code])
  }
}
