import { GenericCommand } from '#command/generic'
import { AuthEntity } from '#core/auth/entity'

export interface AuthLogoutRequest {
  token: string
}

interface AuthLogoutExec {
  auth?: AuthEntity
}

interface AuthLogoutSave {
  auth_id_to_delete?: string
}

export class AuthLogoutCommand extends GenericCommand<
  AuthLogoutRequest,
  AuthLogoutExec,
  AuthLogoutSave
> {
  constructor() {
    super({ name: 'auth:logout' })
  }

  async fetch({ token }: AuthLogoutRequest): Promise<AuthLogoutExec> {
    try {
      const auth = await this.repository.auth.get({ token })
      return { auth }
    } catch (err) {
      return { }
    }
  }

  exec({ auth }: AuthLogoutExec): AuthLogoutSave {
    return { auth_id_to_delete: auth?.id }
  }

  async save({ auth_id_to_delete }: AuthLogoutSave): Promise<void> {
    if (!auth_id_to_delete) {
      return
    }

    await this.repository.auth.delete(auth_id_to_delete)
  }
}
