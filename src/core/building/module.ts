import { BuildingCommands } from './commands'
import { BuildingQueries } from './queries'
import { Module } from '../shared/module'

export type BuildingModule = Module<BuildingQueries, BuildingCommands>
