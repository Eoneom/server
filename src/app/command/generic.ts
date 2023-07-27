import { Factory } from '#core/factory'
import { Repository } from '#shared/repository'


export abstract class GenericCommand<FetchParam, ExecParam, SaveParam> {
  protected repository: Repository

  constructor() {
    this.repository = Factory.getRepository()
  }

  abstract fetch(param: FetchParam): Promise<ExecParam>
  abstract exec(param: ExecParam): SaveParam
  abstract save(param: SaveParam): Promise<void>

  async run(param: FetchParam): Promise<void> {
    const fetched_entities = await this.fetch(param)
    const updated_entities = this.exec(fetched_entities)
    return this.save(updated_entities)
  }
}
