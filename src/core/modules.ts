import { BuildingModule } from '#core/building/module'
import { CityModule } from '#core/city/module'
import { PlayerModule } from '#core/player/module'
import { PricingModule } from '#core/pricing/module'
import { TechnologyModule } from '#core/technology/module'

export type Modules = {
  city: CityModule
  building: BuildingModule
  player: PlayerModule
  technology: TechnologyModule
  pricing: PricingModule
}
