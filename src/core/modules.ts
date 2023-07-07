import { BuildingModule } from './building/module'
import { CityModule } from './city/module'
import { PlayerModule } from './player/module'
import { PricingModule } from './pricing/module'
import { TechnologyModule } from './technology/module'

export type Modules ={
  city: CityModule
  building: BuildingModule
  player: PlayerModule
  technology: TechnologyModule
  pricing: PricingModule
}
