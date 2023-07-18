import { AuthEntity } from '#core/auth/domain/entity'
import { AuthRepository } from '#core/auth/model'
import { AuthDocument, AuthModel } from '#core/auth/model/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoAuthRepository
  extends MongoGenericRepository<typeof AuthModel, AuthDocument, AuthEntity>
  implements AuthRepository {
  protected buildFromModel(document: AuthDocument): AuthEntity {
    return AuthEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      token: document.token
    })
  }
}
