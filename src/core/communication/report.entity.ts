import { BaseEntity } from '#core/type/base.entity'
import { ReportType } from '#core/communication/value/report-type'
import { Coordinates } from '#core/world/value/coordinates'
import { Resource } from '#shared/resource'
import { TroupCode } from '#core/troup/constant/code'

interface ReportTroup {
  code: TroupCode
  count: number
}

type ReportEntityProps = BaseEntity & {
  destination: Coordinates
  origin: Coordinates
  player_id: string
  resource_coefficient?: Resource
  troups: ReportTroup[]
  type: ReportType
  recorded_at: number
}

export class ReportEntity extends BaseEntity {
  readonly destination: Coordinates
  readonly origin: Coordinates
  readonly player_id: string
  readonly resource_coefficient?: Resource
  readonly troups: ReportTroup[]
  readonly type: ReportType
  readonly recorded_at: number

  private constructor({
    id,
    destination,
    origin,
    player_id,
    resource_coefficient,
    troups,
    type,
    recorded_at
  }: ReportEntityProps) {
    super({ id })

    this.destination = destination
    this.origin = origin
    this.player_id = player_id
    this.resource_coefficient = resource_coefficient
    this.troups = troups
    this.type = type
    this.recorded_at = recorded_at
  }

  static create(props: ReportEntityProps): ReportEntity {
    return new ReportEntity(props)
  }

  isOwnedBy(player_id: string): boolean {
    return this.player_id === player_id
  }
}
