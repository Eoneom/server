import { Factory } from '#adapter/factory'
import { AppLogger } from '#app/port/logger'
import { Repository } from '#app/port/repository/generic'

export abstract class GenericQuery<Request, Response> {
  protected repository: Repository
  protected logger: AppLogger

  constructor({ name }: { name: string }) {
    this.repository = Factory.getRepository()
    this.logger = Factory.getLogger(`app:query:${name}`)
  }

  run(req: Request) {
    this.logger.info('run')
    return this.get(req)
  }

  protected abstract get(req: Request): Promise<Response>
}
