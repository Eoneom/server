import { Factory } from '#app/factory'
import { Repository } from '#app/repository/generic'


export abstract class GenericQuery<Request, Response> {
  protected repository: Repository

  constructor() {
    this.repository = Factory.getRepository()
  }

  abstract get(req: Request): Promise<Response>
}