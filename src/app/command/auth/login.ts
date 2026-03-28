import { Factory } from '#adapter/factory'
import { AuthEntity } from '#core/auth/entity'

export interface LoginAuthParams {
  player_name: string
}

export interface LoginAuthResult {
  token: string
}

export async function loginAuth({
  player_name,
}: LoginAuthParams): Promise<LoginAuthResult> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:auth:login')
  logger.info('run')

  const player = await repository.player.getByName(player_name)
  const auth = AuthEntity.generate({ player_id: player.id })

  await repository.auth.create(auth)

  return { token: auth.token }
}
