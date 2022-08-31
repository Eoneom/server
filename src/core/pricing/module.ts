import { Module } from '../shared/module'
import { PricingCommands } from './commands'
import { PricingQueries } from './queries'

export type PricingModule = Module<PricingQueries, PricingCommands>
