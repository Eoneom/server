import { TechnologyEntity } from '#core/technology/entity'
import { Factory } from '#adapter/factory'
import { GenericQuery } from '#query/generic'
import { TechnologyService } from '#core/technology/service'

interface TechnologyListRequest {
  player_id: string
}

export interface TechnologyListQueryResponse {
  technologies: TechnologyEntity[]
}

export class TechnologyListQuery extends GenericQuery<TechnologyListRequest, TechnologyListQueryResponse> {
  constructor() {
    super({ name: 'technology:list' })
  }

  protected async get({ player_id }: TechnologyListRequest): Promise<TechnologyListQueryResponse> {
    const repository = Factory.getRepository()
    const technologies = await repository.technology.list({ player_id })
    return { technologies: TechnologyService.sortTechnologies({ technologies }) }
  }
}
