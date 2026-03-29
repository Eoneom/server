import { AuthorizeQuery } from '#app/query/authorize'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { AuthEntity } from '#core/auth/entity'

describe('AuthorizeQuery', () => {
  const token = 'token_value'
  const auth = AuthEntity.create({
    id: 'auth_id',
    player_id: 'player_id',
    token,
    last_action_at: 100
  })

  let repository: Pick<Repository, 'auth'>

  beforeEach(() => {
    repository = { auth: { get: jest.fn().mockResolvedValue(auth) } as unknown as Repository['auth'] }
    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns player_id from auth', async () => {
    const result = await new AuthorizeQuery().run({ token })

    expect(result.player_id).toBe(auth.player_id)
    expect(repository.auth.get).toHaveBeenCalledWith({ token })
  })
})
