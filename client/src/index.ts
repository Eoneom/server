
import { BuildingEndpoint } from './endpoints/building'
import { PlayerEndpoint } from './endpoints/player'
import { TechnologyEndpoint } from './endpoints/technology'
import { Fetcher } from './fetcher'

export class Client {
  private fetcher: Fetcher
  public player: PlayerEndpoint
  public building: BuildingEndpoint
  public technology: TechnologyEndpoint

  constructor({ base_url}: { base_url: string }) {
    this.fetcher = new Fetcher({ base_url })

    this.player = new PlayerEndpoint({ fetcher: this.fetcher })
    this.building = new BuildingEndpoint({ fetcher: this.fetcher })
    this.technology = new TechnologyEndpoint({ fetcher: this.fetcher })
  }
}
