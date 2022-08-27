import { CityEntity } from './model'

export interface CreateParams {
  name: string
  wood: number
  last_wood_gather: number
}

export interface FindParams {
  name?: string
}

export interface CityRepository {
  exists(name: string): Promise<boolean>
  create(city: CreateParams): Promise<string>
  findOne(query: FindParams): Promise<CityEntity | null>
  findById(id: string): Promise<CityEntity | null>
}