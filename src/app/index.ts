import { Factory } from '../core/factory'
import { Modules } from '../core/modules'
import { AppCommands } from './commands'

export class App {
  modules: Modules
  commands: AppCommands

  constructor() {
    this.modules = Factory.getModules()
    this.commands = new AppCommands()
  }
}
