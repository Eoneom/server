import { AppQueries } from '#app/query/index'
import { Factory } from '#core/factory'
import { Modules } from '#core/modules'

export class App {
  modules: Modules
  queries: AppQueries

  constructor() {
    this.modules = Factory.getModules()
    this.queries = new AppQueries()
  }
}
