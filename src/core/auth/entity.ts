import {
  FAKE_ID, generateToken
} from '#shared/identification'
import { BaseEntity } from '#type/domain'

type AuthEntityProps = BaseEntity & {
  player_id: string
  token: string
}

export class AuthEntity extends BaseEntity {
  readonly player_id: string
  readonly token: string

  private constructor({
    id,
    player_id,
    token
  }: AuthEntityProps) {
    super({ id })
    this.player_id = player_id
    this.token = token
  }

  static create(props: AuthEntityProps): AuthEntity {
    return new AuthEntity(props)
  }

  static generate({ player_id }: { player_id: string }): AuthEntity {
    return new AuthEntity({
      id: FAKE_ID,
      player_id,
      token: generateToken()
    })
  }
}
