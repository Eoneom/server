import { Factory } from '../factory'
import { Modules } from '../modules'
import { AppCommands } from './commands'

export class App {
  modules: Modules
  commands: AppCommands

  constructor() {
    this.modules = Factory.getModules()
    this.commands = new AppCommands()
  }
}
