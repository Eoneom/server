import { BuildingEndpoint } from './endpoints/building'
import { CityEndpoint } from './endpoints/city'
import { PlayerEndpoint } from './endpoints/player'
import { TechnologyEndpoint } from './endpoints/technology'
import { WorldEndpoint } from './endpoints/world'
import { Fetcher } from './fetcher'
export { TechnologyCode } from '../../src/core/technology/constant'
export { BuildingCode } from '../../src/core/building/constant'
export { CellType } from '../../src/core/world/value/cell-type'

export * from './endpoints'
export * from './response'

export class Client {
  private fetcher: Fetcher
  public city: CityEndpoint
  public player: PlayerEndpoint
  public building: BuildingEndpoint
  public technology: TechnologyEndpoint
  public world: WorldEndpoint

  constructor({ base_url }: { base_url: string }) {
    this.fetcher = new Fetcher({ base_url })

    this.city = new CityEndpoint({ fetcher: this.fetcher })
    this.player = new PlayerEndpoint({ fetcher: this.fetcher })
    this.building = new BuildingEndpoint({ fetcher: this.fetcher })
    this.technology = new TechnologyEndpoint({ fetcher: this.fetcher })
    this.world = new WorldEndpoint({ fetcher: this.fetcher })
  }
}
