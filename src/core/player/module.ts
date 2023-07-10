import { Module } from '../../shared/module'
import { PlayerCommands } from './commands'
import { PlayerQueries } from './queries'

export type PlayerModule = Module<PlayerQueries, PlayerCommands>
