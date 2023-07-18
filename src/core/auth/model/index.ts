import { AuthEntity } from '#core/auth/domain/entity'
import { GenericRepository } from '#shared/repository'

export type AuthRepository = GenericRepository<AuthEntity>
