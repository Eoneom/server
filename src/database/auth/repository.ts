import { AuthEntity } from '#core/auth/entity'
import { AuthRepository } from '#app/repository/auth'
import {
  AuthDocument, AuthModel
} from '#database/auth/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoAuthRepository
  extends MongoGenericRepository<typeof AuthModel, AuthDocument, AuthEntity>
  implements AuthRepository {

  async get(query: { token: string }): Promise<AuthEntity> {
    return this.findOneOrThrow(query)
  }

  protected buildFromModel(document: AuthDocument): AuthEntity {
    return AuthEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      token: document.token
    })
  }
}
