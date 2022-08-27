import { getModelForClass, prop } from '@typegoose/typegoose'

class City {
  @prop({ required: true })
  public name?: string

  @prop({ required: true })
  public wood?: number

  @prop({ required: true })
  public last_wood_gather?: number
}

export const CityModel = getModelForClass(City)
