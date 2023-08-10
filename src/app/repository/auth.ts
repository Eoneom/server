import { AuthEntity } from '#core/auth/entity'
import { GenericRepository } from '#app/repository/generic'

export type AuthRepository = GenericRepository<AuthEntity> & {
  get(query: { token: string }): Promise<AuthEntity>
}
