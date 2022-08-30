import { Module } from '../shared/module'
import { TechnologyCommands } from './commands'
import { TechnologyQueries } from './queries'

export type TechnologyModule = Module<TechnologyQueries, TechnologyCommands>
