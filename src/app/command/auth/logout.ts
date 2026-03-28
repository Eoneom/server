import { Factory } from '#adapter/factory'

export interface LogoutAuthParams {
  token: string
}

export async function logoutAuth({ token }: LogoutAuthParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:auth:logout')
  logger.info('run')

  let auth
  try {
    auth = await repository.auth.get({ token })
  } catch {
    return
  }

  await repository.auth.delete(auth.id)
}
