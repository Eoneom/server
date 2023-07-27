import { Factory } from '#core/factory'
import { Repository } from '#shared/repository'

export abstract class GenericCommand<FetchParam, ExecParam, SaveParam, Response = void> {
  protected repository: Repository

  constructor() {
    this.repository = Factory.getRepository()
  }

  async run(param: FetchParam): Promise<Response> {
    const fetched_entities = await this.fetch(param)
    const updated_entities = this.exec(fetched_entities)
    return this.save(updated_entities)
  }

  abstract fetch(param: FetchParam): Promise<ExecParam>
  abstract exec(param: ExecParam): SaveParam
  abstract save(param: SaveParam): Promise<Response>
}
