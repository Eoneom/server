import { Factory } from '#adapter/factory'
import { AppLogger } from '#app/port/logger'
import { Repository } from '#app/port/repository/generic'

export abstract class GenericCommand<FetchParam, ExecParam, SaveParam, Response = void> {
  protected repository: Repository
  protected logger: AppLogger

  protected constructor({ name }: { name: string }) {
    this.repository = Factory.getRepository()
    this.logger = Factory.getLogger(`app:command:${name}`)
  }

  async run(param: FetchParam): Promise<Response> {
    this.logger.info('run')

    const fetched_entities = await this.fetch(param)
    const updated_entities = this.exec(fetched_entities)
    return this.save(updated_entities)
  }

  abstract fetch(param: FetchParam): Promise<ExecParam>
  abstract exec(param: ExecParam): SaveParam
  abstract save(param: SaveParam): Promise<Response>
}
