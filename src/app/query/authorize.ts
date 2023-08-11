import { GenericQuery } from '#query/generic'

interface AuthorizeRequest {
  token: string
}

interface AuthorizeQueryResponse {
  player_id: string
}

export class AuthorizeQuery extends GenericQuery<AuthorizeRequest, AuthorizeQueryResponse> {
  async get({ token }: AuthorizeRequest): Promise<AuthorizeQueryResponse> {
    const auth = await this.repository.auth.get({ token })
    return { player_id: auth.player_id.toString() }
  }
}
