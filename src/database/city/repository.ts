import { CityEntity } from '#core/city/entity'
import { CityRepository } from '#app/repository/city'
import {
  CityDocument, CityModel
} from '#database/city/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoCityRepository
  extends MongoGenericRepository<typeof CityModel, CityDocument, CityEntity>
  implements CityRepository {

  async get(id: string): Promise<CityEntity> {
    return this.findByIdOrThrow(id)
  }

  async list(query: { player_id: string }): Promise<CityEntity[]> {
    return this.find(query)
  }

  async exist(name: string): Promise<boolean> {
    return this.exists({ name })
  }

  async getPlayerCities(player_id: string): Promise<CityEntity[]> {
    return this.find({ player_id })
  }

  protected buildFromModel(document: CityDocument): CityEntity {
    return CityEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      name: document.name,
      plastic: document.plastic,
      mushroom: document.mushroom,
      last_plastic_gather: document.last_plastic_gather,
      last_mushroom_gather: document.last_mushroom_gather
    })
  }
}
