import { CityEntity } from './entity'

export interface CreateParams {
  name: string
  wood: number
  last_wood_gather: number
}

export interface UpdateParams {
  id: string
  wood?: number
  last_wood_gather?: number
}

export interface FindParams {
  name?: string
}

export interface CityRepository {
  exists(name: string): Promise<boolean>
  create(city: CreateParams): Promise<string>
  update(city: UpdateParams): Promise<void>
  findOne(query: FindParams): Promise<CityEntity | null>
  findById(id: string): Promise<CityEntity | null>
}
