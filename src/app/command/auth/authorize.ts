import { Factory } from '#adapter/factory'

export interface AuthorizeAuthParams {
  token: string
  action_at: number
}

export interface AuthorizeAuthResult {
  player_id: string
}

export async function authorizeAuth({
  token,
  action_at,
}: AuthorizeAuthParams): Promise<AuthorizeAuthResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:auth:authorize')
  logger.info('run')

  const auth = await repository.auth.get({ token })
  const updated_auth = auth.updateLastAction(action_at)

  await repository.auth.updateOne(updated_auth)

  return { player_id: updated_auth.player_id }
}
