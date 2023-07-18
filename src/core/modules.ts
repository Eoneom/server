import { AuthModule } from '#core/auth/module'
import { BuildingModule } from '#core/building/module'
import { CityModule } from '#core/city/module'
import { PlayerModule } from '#core/player/module'
import { PricingModule } from '#core/pricing/module'
import { TechnologyModule } from '#core/technology/module'

export type Modules = {
  auth: AuthModule
  building: BuildingModule
  city: CityModule
  player: PlayerModule
  pricing: PricingModule
  technology: TechnologyModule
}
