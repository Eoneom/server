import { ReportEntity } from '#core/communication/report.entity'
import { ReportType } from '#core/communication/value/report-type'
import { TroupEntity } from '#core/troup/entity'
import { MovementEntity } from '#core/troup/movement.entity'
import { id } from '#shared/identification'

type GenerateUnreadParams = {
  type: ReportType
  troups: TroupEntity[]
  movement: MovementEntity
}

export class ReportFactory {
  static generateUnread({
    type,
    troups,
    movement,
  }: GenerateUnreadParams): ReportEntity {
    const report_troups = troups.map(troup => ({
      code: troup.code,
      count: troup.count
    }))

    return ReportEntity.create({
      id: id(),
      type,
      was_read: false,
      troups: report_troups,
      player_id: movement.player_id,
      recorded_at: movement.arrive_at,
      origin: movement.origin,
      destination: movement.destination
    })
  }
}
