import { CityCommands } from './commands'
import { CityQueries } from './queries'
import { Module } from '../shared/module'

export type CityModule = Module<CityQueries, CityCommands>
