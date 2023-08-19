import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyError } from '#core/technology/error'

export class TechnologyService {
  static init({ player_id }: { player_id: string }): TechnologyEntity[] {
    const architecture = TechnologyEntity.initArchitecture({ player_id })

    return [ architecture ]
  }

  static launchResearch({
    is_technology_in_progress,
    technology,
    duration
  }: {
    technology: TechnologyEntity
    duration: number
    is_technology_in_progress: boolean
  }): TechnologyEntity {
    if (is_technology_in_progress) {
      throw new Error(TechnologyError.ALREADY_IN_PROGRESS)
    }

    return technology.launchResearch(duration)
  }
}
