import { Factory } from '../core/factory'
import { Modules } from '../core/modules'
import { AppCommands } from './commands'
import { AppQueries } from './queries'

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
