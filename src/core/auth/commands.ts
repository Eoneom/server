import { AuthEntity } from '#core/auth/domain/entity'

export class AuthCommands {
  async login({ player_id }: {
    player_id: string
  }): Promise<AuthEntity> {
    return AuthEntity.generate({ player_id })
  }
}
