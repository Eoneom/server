import {
  modelOptions,
  prop
} from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { _id: false } })
export class CoordinatesDocument {
  @prop({ required: true })
  public x!: number

  @prop({ required: true })
  public y!: number

  @prop({ required: true })
  public sector!: number
}
