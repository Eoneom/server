import { AuthCommands } from '#core/auth/commands'
import { AuthQueries } from '#core/auth/queries'
import { Module } from '#shared/module'

export class AuthModule extends Module<AuthQueries, AuthCommands> {
  private static instance: AuthModule

  static getInstance(): AuthModule {
    if (!this.instance) {
      const queries = new AuthQueries()
      const commands = new AuthCommands()
      this.instance = new AuthModule({
        commands,
        queries 
      })
    }

    return this.instance
  }
}
