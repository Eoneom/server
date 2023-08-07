import { BuildingEndpoint } from './endpoints/building'
import { PlayerEndpoint } from './endpoints/player'
import { TechnologyEndpoint } from './endpoints/technology'
import { Fetcher } from './fetcher'
export { TechnologyCode } from '../../src/core/technology/constants'
export { BuildingCode } from '../../src/core/building/constants'
export * from './endpoints/building/list'
export * from './endpoints/building/upgrade'
export * from './endpoints/player/login'
export * from './endpoints/player/signup'
export * from './endpoints/player/sync'
export * from './endpoints/technology/list'
export * from './endpoints/technology/research'
export * from './endpoints/requirement/index'
export * from './response'

export class Client {
  private fetcher: Fetcher
  public player: PlayerEndpoint
  public building: BuildingEndpoint
  public technology: TechnologyEndpoint

  constructor({ base_url }: { base_url: string }) {
    this.fetcher = new Fetcher({ base_url })

    this.player = new PlayerEndpoint({ fetcher: this.fetcher })
    this.building = new BuildingEndpoint({ fetcher: this.fetcher })
    this.technology = new TechnologyEndpoint({ fetcher: this.fetcher })
  }
}
