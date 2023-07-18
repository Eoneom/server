import { AppCommands } from '#app/command/index'
import { AppQueries } from '#app/query/index'
import { Factory } from '#core/factory'
import { Modules } from '#core/modules'

export class App {
  modules: Modules
  commands: AppCommands
  queries: AppQueries

  constructor() {
    this.modules = Factory.getModules()
    this.commands = new AppCommands()
    this.queries = new AppQueries()
  }
}
