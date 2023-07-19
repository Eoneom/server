import { Factory } from '#core/factory'
import { PricingCommands } from '#core/pricing/commands'
import { PricingQueries } from '#core/pricing/queries'
import { Module } from '#shared/module'

export class PricingModule extends Module<PricingQueries, PricingCommands> {
  private static instance: PricingModule

  constructor({
    queries,
    commands
  }: {
    queries: PricingQueries,
    commands: PricingCommands
  }) {
    super({
      queries,
      commands 
    })
  }

  static getInstance(): PricingModule {
    if (!this.instance) {
      const unit_repository = Factory.getRepository().unit_cost
      const level_repository = Factory.getRepository().level_cost
      const queries = new PricingQueries({
        unit_repository,
        level_repository
      })
      const commands = new PricingCommands({
        unit_repository,
        level_repository
      })
      this.instance = new PricingModule({
        commands,
        queries 
      })
    }

    return this.instance
  }
}
