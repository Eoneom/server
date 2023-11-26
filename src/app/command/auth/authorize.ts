import { GenericCommand } from '#app/command/generic'
import { AuthEntity } from '#core/auth/entity'

interface AuthAuthorizeRequest {
  token: string
  action_at: number
}

interface AuthAuthorizeExec {
  auth: AuthEntity
  action_at: number
}

interface AuthAuthorizeSave {
  auth: AuthEntity
}

interface AuthAuthorizeResponse {
  player_id: string
}

export class AuthAuthorizeCommand extends GenericCommand<
  AuthAuthorizeRequest,
  AuthAuthorizeExec,
  AuthAuthorizeSave,
  AuthAuthorizeResponse
> {
  constructor() {
    super({ name: 'auth:authorize' })
  }
  async fetch({
    token,
    action_at
  }: AuthAuthorizeRequest): Promise<AuthAuthorizeExec> {
    const auth = await this.repository.auth.get({ token })
    return {
      auth,
      action_at
    }
  }

  exec({
    auth,
    action_at
  }: AuthAuthorizeExec): AuthAuthorizeSave {
    return { auth: auth.updateLastAction(action_at) }
  }

  async save({ auth }: AuthAuthorizeSave): Promise<AuthAuthorizeResponse> {
    await this.repository.auth.updateOne(auth)
    return { player_id: auth.player_id }
  }
}
