import { GenericCommand } from '#command/generic'
import { AuthEntity } from '#core/auth/entity'

export interface AuthLoginRequest {
  player_name: string
}

interface AuthLoginExec {
  player_id: string
}

interface AuthLoginSave {
  auth: AuthEntity
}

export interface AuthLoginResponse {
  token: string
}

export class AuthLoginCommand extends GenericCommand<
  AuthLoginRequest,
  AuthLoginExec,
  AuthLoginSave,
  AuthLoginResponse
> {
  constructor() {
    super({ name: 'auth:login' })
  }

  async fetch({ player_name }: AuthLoginRequest): Promise<AuthLoginExec> {
    const player = await this.repository.player.getByName(player_name)
    return { player_id: player.id }
  }

  exec({ player_id }: AuthLoginExec): AuthLoginSave {
    return { auth: AuthEntity.generate({ player_id }) }
  }

  async save({ auth }: AuthLoginSave): Promise<AuthLoginResponse> {
    await this.repository.auth.create(auth)
    return { token: auth.token }
  }

}
