import { CoordinatesDocument } from '#adapter/repository/shared/coordinates'
import { ReportType } from '#core/communication/value/report-type'
import { TroupCode } from '#core/troup/constant'
import {
  getModelForClass,
  mongoose,
  prop
} from '@typegoose/typegoose'

import { Document } from 'mongoose'

class ReportTroup {
  @prop({
    required: true,
    enum: TroupCode
  })
  public code!: TroupCode

  @prop({ required: true })
  public count!: number
}

class Report {
  @prop({
    required: true,
    enum: ReportType
  })
  public type!: ReportType

  @prop({ required: true })
  public player_id!: mongoose.Types.ObjectId

  @prop({ required: true })
  public origin!: CoordinatesDocument

  @prop({ required: true })
  public destination!: CoordinatesDocument

  @prop({ required: true })
  public troups!: ReportTroup[]

  @prop({ required: true })
  public recorded_at!: number
}

export type ReportDocument = Document & Report
export const ReportModel = getModelForClass(Report)
