import { BuildingEndpoint } from './endpoints/building'
import { CityEndpoint } from './endpoints/city'
import { CommunicationEndpoint } from './endpoints/communication'
import { PlayerEndpoint } from './endpoints/player'
import { TechnologyEndpoint } from './endpoints/technology'
import { TroupEndpoint } from './endpoints/troup'
import { WorldEndpoint } from './endpoints/world'
import { Fetcher } from './fetcher'
export { TechnologyCode } from '../../src/core/technology/constant'
export { BuildingCode } from '../../src/core/building/constant/code'
export { CellType } from '../../src/core/world/value/cell-type'
export { TroupCode } from '../../src/core/troup/constant'
export { ReportType } from '../../src/core/communication/value/report-type'

export * from './endpoints'
export * from './response'

export class Client {
  private fetcher: Fetcher
  public city: CityEndpoint
  public communication: CommunicationEndpoint
  public player: PlayerEndpoint
  public building: BuildingEndpoint
  public technology: TechnologyEndpoint
  public troup: TroupEndpoint
  public world: WorldEndpoint

  constructor({ base_url }: { base_url: string }) {
    this.fetcher = new Fetcher({ base_url })

    this.city = new CityEndpoint({ fetcher: this.fetcher })
    this.communication = new CommunicationEndpoint({ fetcher: this.fetcher })
    this.player = new PlayerEndpoint({ fetcher: this.fetcher })
    this.building = new BuildingEndpoint({ fetcher: this.fetcher })
    this.technology = new TechnologyEndpoint({ fetcher: this.fetcher })
    this.troup = new TroupEndpoint({ fetcher: this.fetcher })
    this.world = new WorldEndpoint({ fetcher: this.fetcher })
  }
}
