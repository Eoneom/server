import { GenericCommand } from '#app/command/generic'
import { AuthEntity } from '#core/auth/domain/entity'

export interface LoginRequest {
  player_name: string
}

interface LoginExec {
  player_id: string
}

interface LoginSave {
  auth: AuthEntity
}

export interface LoginResponse {
  token: string
}

export class LoginCommand extends GenericCommand<
  LoginRequest,
  LoginExec,
  LoginSave,
  LoginResponse
> {
  async fetch({ player_name }: LoginRequest): Promise<LoginExec> {
    const player = await this.repository.player.findOneOrThrow({ name: player_name })
    return { player_id: player.id }
  }
  exec({ player_id }: LoginExec): LoginSave {
    return { auth: AuthEntity.generate({ player_id }) }
  }
  async save({ auth }: LoginSave): Promise<LoginResponse> {
    await this.repository.auth.create(auth)
    return { token: auth.token }
  }

}
