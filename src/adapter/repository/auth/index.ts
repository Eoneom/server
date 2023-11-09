import { AuthEntity } from '#core/auth/entity'
import { AuthRepository } from '#app/port/repository/auth'
import {
  AuthDocument,
  AuthModel
} from '#adapter/repository/auth/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { AuthError } from '#core/auth/error'

export class MongoAuthRepository
  extends MongoGenericRepository<typeof AuthModel, AuthDocument, AuthEntity>
  implements AuthRepository {

  constructor() {
    super(AuthModel, AuthError.NOT_FOUND)
  }

  async get(query: { token: string }): Promise<AuthEntity> {
    return this.findOneOrThrow(query)
  }

  protected buildFromModel(document: AuthDocument): AuthEntity {
    return AuthEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      token: document.token,
      last_action_at: document.last_action_at
    })
  }
}
